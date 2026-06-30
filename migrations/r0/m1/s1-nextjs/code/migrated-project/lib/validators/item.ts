import type { ItemFormValues } from "@/lib/types";

export type ItemFormErrors = Partial<Record<keyof ItemFormValues, string>>;

export function validateItemForm(values: ItemFormValues): ItemFormErrors | null {
  const errors: ItemFormErrors = {};

  if (!values.description?.trim()) {
    errors.description = "Description is required.";
  } else if (values.description.length > 75) {
    errors.description = "Description cannot exceed 75 characters.";
  }

  if (!values.retailValue || isNaN(Number(values.retailValue))) {
    errors.retailValue = "Retail Value must be a number.";
  }

  if (!values.donorID || !/^\d+$/.test(values.donorID)) {
    errors.donorID = "Donor is required.";
  }

  if (
    values.lotID &&
    values.lotID !== "NULL" &&
    !/^\d+$/.test(values.lotID)
  ) {
    errors.lotID = "Lot must be a valid selection.";
  }

  return Object.keys(errors).length > 0 ? errors : null;
}
