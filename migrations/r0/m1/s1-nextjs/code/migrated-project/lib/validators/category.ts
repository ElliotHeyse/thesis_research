import type { CategoryFormValues } from "@/lib/types";

export type CategoryFormErrors = Partial<
  Record<keyof CategoryFormValues, string>
>;

export function validateCategoryForm(
  values: CategoryFormValues,
): CategoryFormErrors | null {
  const errors: CategoryFormErrors = {};

  if (!values.description) {
    errors.description = "Description is required";
  } else if (values.description.length > 255) {
    errors.description = "Description must be less than 255 characters";
  }

  return Object.keys(errors).length > 0 ? errors : null;
}
