import { query, execute } from "@/lib/db";
import type { Category, CategoryFormValues } from "@/lib/types";
import { RowDataPacket } from "mysql2/promise";

export async function getCategories(): Promise<Category[]> {
  return query<Category & RowDataPacket>("SELECT * FROM category");
}

export async function getCategory(categoryId: number): Promise<Category | null> {
  const rows = await query<Category & RowDataPacket>(
    "SELECT * FROM category WHERE CategoryID = ?",
    [categoryId],
  );
  return rows[0] ?? null;
}

export async function addCategory(values: CategoryFormValues): Promise<boolean> {
  try {
    await execute("INSERT INTO category (Description) VALUES (?)", [
      values.description,
    ]);
    return true;
  } catch {
    return false;
  }
}

export async function updateCategory(
  categoryId: number,
  values: CategoryFormValues,
): Promise<boolean> {
  try {
    await execute("UPDATE category SET Description = ? WHERE CategoryID = ?", [
      values.description,
      categoryId,
    ]);
    return true;
  } catch {
    return false;
  }
}

export async function deleteCategory(categoryId: number): Promise<boolean> {
  try {
    await execute("DELETE FROM category WHERE CategoryID = ?", [categoryId]);
    return true;
  } catch {
    return false;
  }
}

export async function getCategoryDescriptions(): Promise<Category[]> {
  return query<Category & RowDataPacket>(
    "SELECT CategoryID, Description FROM category",
  );
}
