import { query, execute } from "@/lib/db";
import type { Donor, DonorFormValues, DonorWithReceiptStats, Item } from "@/lib/types";
import { RowDataPacket } from "mysql2/promise";

export async function getDonors(): Promise<Donor[]> {
  return query<Donor & RowDataPacket>(
    "SELECT * FROM donor ORDER BY BusinessName, ContactName",
  );
}

export async function getDonor(donorId: number): Promise<Donor | null> {
  const rows = await query<Donor & RowDataPacket>(
    "SELECT * FROM donor WHERE DonorID = ?",
    [donorId],
  );
  return rows[0] ?? null;
}

export async function getDonorsForSelect(): Promise<
  Pick<Donor, "DonorID" | "BusinessName" | "ContactName">[]
> {
  return query<Pick<Donor, "DonorID" | "BusinessName" | "ContactName"> & RowDataPacket>(
    "SELECT DonorID, BusinessName, ContactName FROM donor ORDER BY BusinessName, ContactName",
  );
}

export async function getDonorsWithoutReceipt(): Promise<DonorWithReceiptStats[]> {
  return query<DonorWithReceiptStats & RowDataPacket>(
    `SELECT d.*, COUNT(i.ItemID) AS TotalItems, SUM(i.RetailValue) AS TotalValue
     FROM donor d
     INNER JOIN item i ON d.DonorID = i.DonorID
     WHERE d.TaxReceipt = 0
     GROUP BY d.DonorID
     HAVING TotalItems > 0
     ORDER BY d.ContactName, d.BusinessName`,
  );
}

export async function getDonorsEligibleForReceipt(): Promise<Donor[]> {
  const allDonors = await getDonors();
  const eligible: Donor[] = [];

  for (const donor of allDonors) {
    const items = await getItemsByDonorId(donor.DonorID);
    if (items.length > 0 && !donor.TaxReceipt) {
      eligible.push(donor);
    }
  }

  return eligible;
}

export async function getItemsByDonorId(donorId: number): Promise<Item[]> {
  return query<Item & RowDataPacket>(
    "SELECT * FROM item WHERE DonorID = ? ORDER BY Description",
    [donorId],
  );
}

export async function donorHasItems(donorId: number): Promise<boolean> {
  const rows = await query<{ count: number } & RowDataPacket>(
    "SELECT COUNT(*) AS count FROM item WHERE DonorID = ?",
    [donorId],
  );
  return (rows[0]?.count ?? 0) > 0;
}

export async function addDonor(values: DonorFormValues): Promise<boolean> {
  try {
    await execute(
      `INSERT INTO donor (
        BusinessName, ContactName, ContactEmail, ContactTitle,
        Address, City, State, ZipCode, TaxReceipt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        values.businessName || null,
        values.contactName,
        values.contactEmail,
        values.contactTitle || null,
        values.address,
        values.city,
        values.state,
        values.zipCode,
        values.taxReceipt ? 1 : 0,
      ],
    );
    return true;
  } catch {
    return false;
  }
}

export async function updateDonor(
  donorId: number,
  values: DonorFormValues,
): Promise<boolean> {
  try {
    await execute(
      `UPDATE donor SET
        BusinessName = ?, ContactName = ?, ContactEmail = ?, ContactTitle = ?,
        Address = ?, City = ?, State = ?, ZipCode = ?, TaxReceipt = ?
       WHERE DonorID = ?`,
      [
        values.businessName || null,
        values.contactName,
        values.contactEmail,
        values.contactTitle || null,
        values.address,
        values.city,
        values.state,
        values.zipCode,
        values.taxReceipt ? 1 : 0,
        donorId,
      ],
    );
    return true;
  } catch {
    return false;
  }
}

export async function deleteDonor(donorId: number): Promise<boolean> {
  if (await donorHasItems(donorId)) {
    return false;
  }

  try {
    await execute("DELETE FROM donor WHERE DonorID = ?", [donorId]);
    return true;
  } catch {
    return false;
  }
}

export async function markReceiptSent(donorId: number): Promise<boolean> {
  try {
    await execute("UPDATE donor SET TaxReceipt = 1 WHERE DonorID = ?", [donorId]);
    return true;
  } catch {
    return false;
  }
}
