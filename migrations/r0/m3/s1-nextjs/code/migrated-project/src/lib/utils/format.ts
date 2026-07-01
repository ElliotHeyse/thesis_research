export function formatOrDash(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "-";
  }
  return String(value);
}

export function formatYesNo(value: unknown): string {
  return value ? "Yes" : "No";
}

export function formatCurrency(amount: unknown): string {
  if (amount === null || amount === undefined || amount === "") {
    return "-";
  }
  return `$${Number(amount).toFixed(2)}`;
}

export function donorDisplayName(donor: {
  BusinessName?: string | null;
  ContactName?: string;
}): string {
  if (donor.BusinessName) {
    return donor.BusinessName;
  }
  return donor.ContactName ?? "";
}
