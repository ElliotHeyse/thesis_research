export function formatOrDash(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") {
    return "—";
  }
  return String(value);
}

export function formatCurrency(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === "") {
    return "—";
  }
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (Number.isNaN(num)) return "—";
  return `$${num.toFixed(2)}`;
}

export function formatYesNo(value: boolean | number | null | undefined): string {
  return value ? "Yes" : "No";
}

export function donorDisplayName(donor: {
  BusinessName?: string | null;
  ContactName?: string | null;
}): string {
  if (donor.BusinessName) {
    return donor.BusinessName;
  }
  return donor.ContactName ?? "";
}
