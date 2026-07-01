"use server";

import { redirect } from "next/navigation";
import { ValidationError } from "@/lib/errors";
import * as categoryService from "@/lib/services/category.service";

export async function saveCategoryAction(formData: FormData) {
  const categoryId = formData.get("CategoryID");
  const isEdit = categoryId && String(categoryId) !== "" && String(categoryId) !== "null";
  try {
    const data = { description: String(formData.get("Description") ?? "") };
    if (isEdit) {
      await categoryService.updateCategory(Number(categoryId), data);
    } else {
      await categoryService.createCategory(data);
    }
    redirect("/lots/categories?success=updated");
  } catch (error) {
    if (error instanceof ValidationError) {
      redirect(
        `/lots/categories/${isEdit ? `${categoryId}/edit` : "new"}?error=validation`,
      );
    }
    redirect("/lots/categories?error=update_failed");
  }
}

export async function deleteCategoryAction(categoryId: number) {
  try {
    await categoryService.deleteCategory(categoryId);
    redirect("/lots/categories?success=deleted");
  } catch {
    redirect("/lots/categories?error=delete_failed");
  }
}
