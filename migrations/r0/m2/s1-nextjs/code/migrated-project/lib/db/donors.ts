import { RowDataPacket, ResultSetHeader } from "mysql2";
import { getPool } from "./pool";
import type {
  Donor,
  DonorFormValues,
  DonorWithReceiptStats,
  Item,
} from "./types";

export async function getDonors(): Promise<Donor[]> {
  const [rows] = await getPool().query<RowDataPacket[]>(
    "SELECT * FROM Donor ORDER BY BusinessName, ContactName"
  );
  return rows as Donor[];
}

export async function getDonor(donorId: number): Promise<Donor | null> {
  const [rows] = await getPool().query<RowDataPacket[]>(
    "SELECT * FROM Donor WHERE DonorID = ?",
    [donorId]
  );
  return (rows[0] as Donor) ?? null;
}

export async function getDonorsForSelect(): Promise<
  Pick<Donor, "DonorID" | "BusinessName" | "ContactName">[]
> {
  const [rows] = await getPool().query<RowDataPacket[]>(
    "SELECT DonorID, BusinessName, ContactName FROM Donor ORDER BY BusinessName, ContactName"
  );
  return rows as Pick<Donor, "DonorID" | "BusinessName" | "ContactName">[];
}

export async function getDonorsWithoutReceipt(): Promise<DonorWithReceiptStats[]> {
  const [rows] = await getPool().query<RowDataPacket[]>(
    `SELECT d.*, COUNT(i.ItemID) AS TotalItems, SUM(i.RetailValue) AS TotalValue
     FROM Donor d
     INNER JOIN Item i ON d.DonorID = i.DonorID
     WHERE d.TaxReceipt = 0
     GROUP BY d.DonorID
     HAVING TotalItems > 0
     ORDER BY d.ContactName, d.BusinessName`
  );
  return rows as DonorWithReceiptStats[];
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
  const [rows] = await getPool().query<RowDataPacket[]>(
    "SELECT * FROM Item WHERE DonorID = ? ORDER BY Description",
    [donorId]
  );
  return rows as Item[];
}

export async function donorHasItems(donorId: number): Promise<boolean> {
  const [rows] = await getPool().query<RowDataPacket[]>(
    "SELECT COUNT(*) AS count FROM Item WHERE DonorID = ?",
    [donorId]
  );
  return Number(rows[0]?.count ?? 0) > 0;
}

export async function addDonor(values: DonorFormValues): Promise<boolean> {
  try {
    await getPool().query(
      `INSERT INTO Donor (
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
      ]
    );
    return true;
  } catch {
    return false;
  }
}

export async function updateDonor(
  donorId: number,
  values: DonorFormValues
): Promise<boolean> {
  try {
    await getPool().query(
      `UPDATE Donor SET
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
      ]
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
    const [result] = await getPool().query<ResultSetHeader>(
      "DELETE FROM Donor WHERE DonorID = ?",
      [donorId]
    );
    return result.affectedRows > 0;
  } catch {
    return false;
  }
}

export async function markReceiptSent(donorId: number): Promise<boolean> {
  try {
    await getPool().query("UPDATE Donor SET TaxReceipt = 1 WHERE DonorID = ?", [
      donorId,
    ]);
    return true;
  } catch {
    return false;
  }
}
