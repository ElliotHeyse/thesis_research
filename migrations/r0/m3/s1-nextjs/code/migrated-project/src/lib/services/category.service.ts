import * as categoryRepo from "@/lib/repositories/category.repository";
import { parseCategoryInput } from "@/lib/validation/category.schema";

export async function listCategories() {
  return categoryRepo.findAllCategories();
}

export async function getCategory(categoryId: number) {
  return categoryRepo.findCategoryById(categoryId);
}

export async function createCategory(data: unknown) {
  const parsed = parseCategoryInput(data);
  await categoryRepo.createCategory({ description: parsed.description });
}

export async function updateCategory(categoryId: number, data: unknown) {
  const parsed = parseCategoryInput(data);
  await categoryRepo.updateCategory(categoryId, {
    description: parsed.description,
  });
}

export async function deleteCategory(categoryId: number) {
  await categoryRepo.deleteCategory(categoryId);
}
