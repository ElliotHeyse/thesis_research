import type { LotFormValues } from "@/lib/types";

export type LotFormErrors = Partial<Record<keyof LotFormValues, string>>;

export function validateLotForm(values: LotFormValues): LotFormErrors | null {
  const errors: LotFormErrors = {};

  if (!values.description) {
    errors.description = "Description is required";
  } else if (values.description.length > 255) {
    errors.description = "Description must be less than 255 characters";
  }

  if (values.highestBid) {
    if (isNaN(Number(values.highestBid))) {
      errors.highestBid = "Highest bid must be a number";
    } else if (Number(values.highestBid) < 0) {
      errors.highestBid = "Highest bid must be greater than 0";
    }
  }

  if (values.image) {
    try {
      new URL(values.image);
      if (!/^https?:\/\/.+$/.test(values.image)) {
        errors.image = "Image URL must start with http:// or https://";
      }
    } catch {
      errors.image = "Image URL must be a valid URL";
    }
  }

  return Object.keys(errors).length > 0 ? errors : null;
}
