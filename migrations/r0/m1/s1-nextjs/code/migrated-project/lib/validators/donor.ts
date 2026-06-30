import type { DonorFormValues } from "@/lib/types";

export type DonorFormErrors = Partial<Record<keyof DonorFormValues, string>>;

export function validateDonorForm(
  values: DonorFormValues,
): DonorFormErrors | null {
  const errors: DonorFormErrors = {};

  if ((values.businessName?.length ?? 0) > 75) {
    errors.businessName = "Business Name cannot exceed 75 characters.";
  }
  if (!values.contactName?.trim()) {
    errors.contactName = "Contact Name is required.";
  } else if (values.contactName.length > 75) {
    errors.contactName = "Contact Name cannot exceed 75 characters.";
  }
  if ((values.contactTitle?.length ?? 0) > 75) {
    errors.contactTitle = "Contact Title cannot exceed 75 characters.";
  }
  if ((values.address?.length ?? 0) > 75) {
    errors.address = "Address cannot exceed 75 characters.";
  }
  if ((values.city?.length ?? 0) > 30) {
    errors.city = "City cannot exceed 30 characters.";
  }
  if ((values.state?.length ?? 0) > 2) {
    errors.state = "State cannot exceed 2 characters.";
  }
  if ((values.zipCode?.length ?? 0) > 5) {
    errors.zipCode = "Zip Code cannot exceed 5 characters.";
  }
  if (values.contactEmail) {
    if (values.contactEmail.length > 200) {
      errors.contactEmail = "Email cannot exceed 200 characters.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.contactEmail)) {
      errors.contactEmail = "Invalid email format.";
    }
  }
  if (values.zipCode && !/^\d+$/.test(values.zipCode)) {
    errors.zipCode = "Zip Code must be numeric.";
  }

  return Object.keys(errors).length > 0 ? errors : null;
}
