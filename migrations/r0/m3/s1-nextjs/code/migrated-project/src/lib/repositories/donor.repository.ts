import { execute, query, queryOne } from "@/lib/db/pool";
import type {
  Donor,
  DonorInput,
  DonorPendingReceipt,
  DonorSelect,
  Item,
} from "@/lib/types";

export async function findAllDonors(): Promise<Donor[]> {
  return query<Donor>(
    "SELECT * FROM Donor ORDER BY BusinessName, ContactName",
  );
}

export async function findDonorById(donorId: number): Promise<Donor | null> {
  return queryOne<Donor>("SELECT * FROM Donor WHERE DonorID = ?", [donorId]);
}

export async function findDonorsForSelect(): Promise<DonorSelect[]> {
  return query<DonorSelect>(
    "SELECT DonorID, BusinessName, ContactName FROM Donor ORDER BY BusinessName, ContactName",
  );
}

export async function findDonorsWithoutReceipt(): Promise<DonorPendingReceipt[]> {
  return query<DonorPendingReceipt>(
    `SELECT d.*, COUNT(i.ItemID) AS TotalItems, SUM(i.RetailValue) AS TotalValue
     FROM Donor d
     INNER JOIN Item i ON d.DonorID = i.DonorID
     WHERE d.TaxReceipt = 0
     GROUP BY d.DonorID
     HAVING TotalItems > 0
     ORDER BY d.ContactName, d.BusinessName`,
  );
}

export async function findItemsByDonorId(donorId: number): Promise<Item[]> {
  return query<Item>(
    "SELECT * FROM Item WHERE DonorID = ? ORDER BY Description",
    [donorId],
  );
}

export async function donorHasItems(donorId: number): Promise<boolean> {
  const result = await queryOne<{ count: number }>(
    "SELECT COUNT(*) AS count FROM Item WHERE DonorID = ?",
    [donorId],
  );
  return (result?.count ?? 0) > 0;
}

export async function createDonor(values: DonorInput): Promise<void> {
  await execute(
    `INSERT INTO Donor (
       BusinessName, ContactName, ContactEmail, ContactTitle,
       Address, City, State, ZipCode, TaxReceipt
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      values.businessName ?? null,
      values.contactName,
      values.contactEmail ?? "",
      values.contactTitle ?? null,
      values.address ?? "",
      values.city ?? "",
      values.state ?? "",
      values.zipCode ?? "",
      values.taxReceipt ? 1 : 0,
    ],
  );
}

export async function updateDonor(
  donorId: number,
  values: DonorInput,
): Promise<void> {
  await execute(
    `UPDATE Donor SET
       BusinessName = ?, ContactName = ?, ContactEmail = ?, ContactTitle = ?,
       Address = ?, City = ?, State = ?, ZipCode = ?, TaxReceipt = ?
     WHERE DonorID = ?`,
    [
      values.businessName ?? null,
      values.contactName,
      values.contactEmail ?? "",
      values.contactTitle ?? null,
      values.address ?? "",
      values.city ?? "",
      values.state ?? "",
      values.zipCode ?? "",
      values.taxReceipt ? 1 : 0,
      donorId,
    ],
  );
}

export async function deleteDonor(donorId: number): Promise<void> {
  await execute("DELETE FROM Donor WHERE DonorID = ?", [donorId]);
}

export async function markReceiptSent(donorId: number): Promise<void> {
  await execute("UPDATE Donor SET TaxReceipt = 1 WHERE DonorID = ?", [donorId]);
}
