"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  addCategory,
  deleteCategory,
  updateCategory,
} from "@/lib/repositories/categories";
import type { CategoryFormValues } from "@/lib/types";
import { validateCategoryForm } from "@/lib/validators/category";

export async function saveCategoryFormAction(
  _prev: { errors?: Record<string, string> },
  formData: FormData,
): Promise<{ errors?: Record<string, string> }> {
  const categoryId = formData.get("categoryId")
    ? Number(formData.get("categoryId"))
    : null;
  const values: CategoryFormValues = {
    description: String(formData.get("description") ?? ""),
  };
  const errors = validateCategoryForm(values);
  if (errors) {
    return { errors };
  }

  const ok = categoryId
    ? await updateCategory(categoryId, values)
    : await addCategory(values);

  revalidatePath("/lots/categories");
  if (!ok) {
    return { errors: { description: "Failed to save category." } };
  }

  redirect("/lots/categories");
}

export async function confirmDeleteCategoryAction(categoryId: number) {
  const ok = await deleteCategory(categoryId);
  revalidatePath("/lots/categories");
  redirect(
    `/lots/categories?${ok ? "success=deleted" : "error=delete_failed"}`,
  );
}
