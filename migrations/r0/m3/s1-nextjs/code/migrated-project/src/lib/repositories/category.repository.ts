import { execute, query, queryOne } from "@/lib/db/pool";
import type { Category, CategoryInput } from "@/lib/types";

export async function findAllCategories(): Promise<Category[]> {
  return query<Category>("SELECT * FROM Category");
}

export async function findCategoryById(
  categoryId: number,
): Promise<Category | null> {
  return queryOne<Category>(
    "SELECT * FROM Category WHERE CategoryID = ?",
    [categoryId],
  );
}

export async function createCategory(values: CategoryInput): Promise<void> {
  await execute("INSERT INTO Category (Description) VALUES (?)", [
    values.description,
  ]);
}

export async function updateCategory(
  categoryId: number,
  values: CategoryInput,
): Promise<void> {
  await execute("UPDATE Category SET Description = ? WHERE CategoryID = ?", [
    values.description,
    categoryId,
  ]);
}

export async function deleteCategory(categoryId: number): Promise<void> {
  await execute("DELETE FROM Category WHERE CategoryID = ?", [categoryId]);
}
