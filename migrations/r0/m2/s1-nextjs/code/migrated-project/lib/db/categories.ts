import { RowDataPacket, ResultSetHeader } from "mysql2";
import { getPool } from "./pool";
import type {
  Category,
  CategoryFormValues,
} from "./types";

export async function getCategories(): Promise<Category[]> {
  const [rows] = await getPool().query<RowDataPacket[]>(
    "SELECT * FROM Category"
  );
  return rows as Category[];
}

export async function getCategory(
  categoryId: number
): Promise<Category | null> {
  const [rows] = await getPool().query<RowDataPacket[]>(
    "SELECT * FROM Category WHERE CategoryID = ?",
    [categoryId]
  );
  return (rows[0] as Category) ?? null;
}

export async function addCategory(
  values: CategoryFormValues
): Promise<boolean> {
  try {
    await getPool().query("INSERT INTO Category (Description) VALUES (?)", [
      values.description,
    ]);
    return true;
  } catch {
    return false;
  }
}

export async function updateCategory(
  categoryId: number,
  values: CategoryFormValues
): Promise<boolean> {
  try {
    await getPool().query(
      "UPDATE Category SET Description = ? WHERE CategoryID = ?",
      [values.description, categoryId]
    );
    return true;
  } catch {
    return false;
  }
}

export async function deleteCategory(categoryId: number): Promise<boolean> {
  try {
    const [result] = await getPool().query<ResultSetHeader>(
      "DELETE FROM Category WHERE CategoryID = ?",
      [categoryId]
    );
    return result.affectedRows > 0;
  } catch {
    return false;
  }
}

export async function getCategoryDescriptions(): Promise<
  Pick<Category, "CategoryID" | "Description">[]
> {
  const [rows] = await getPool().query<RowDataPacket[]>(
    "SELECT CategoryID, Description FROM Category"
  );
  return rows as Pick<Category, "CategoryID" | "Description">[];
}
