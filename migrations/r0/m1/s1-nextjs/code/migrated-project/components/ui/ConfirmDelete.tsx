import { formatCurrency } from "@/lib/format";
import { LinkButton } from "@/components/ui/Button";

const ENTITY_FIELDS: Record<
  string,
  Record<string, string | { key: string; format?: string }>
> = {
  donor: {
    "Donor ID": "DonorID",
    "Business Name": "BusinessName",
    "Contact Name": "ContactName",
    Email: "ContactEmail",
    City: "City",
  },
  item: {
    "Item ID": "ItemID",
    Description: "Description",
    "Retail Value": { key: "RetailValue", format: "currency" },
    "Donor ID": "DonorID",
  },
  lot: {
    "Lot ID": "LotID",
    Description: "Description",
    "Category ID": "CategoryID",
  },
  category: {
    "Category ID": "CategoryID",
    Description: "Description",
  },
};

function formatValue(
  entity: Record<string, unknown>,
  fieldConfig: string | { key: string; format?: string },
): string {
  if (typeof fieldConfig === "object") {
    const value = entity[fieldConfig.key];
    if (fieldConfig.format === "currency") {
      return formatCurrency(value ?? 0);
    }
    return String(value ?? "N/A");
  }
  return String(entity[fieldConfig] ?? "N/A");
}

export function ConfirmDelete({
  entityType,
  entity,
  returnUrl,
  confirmAction,
}: {
  entityType: string;
  entity: Record<string, unknown>;
  returnUrl: string;
  confirmAction: () => Promise<void>;
}) {
  const fields = ENTITY_FIELDS[entityType] ?? {};

  return (
    <div className="confirm-container">
      <h2 className="confirm-title">Confirm Deletion</h2>
      <p style={{ textAlign: "center", marginBottom: 30 }}>
        <strong>Are you sure you want to delete this {entityType}?</strong>
        <br />
        This action cannot be undone.
      </p>
      <div className="entity-details">
        {Object.entries(fields).map(([label, config]) => (
          <p key={label}>
            <strong>{label}:</strong> {formatValue(entity, config)}
          </p>
        ))}
      </div>
      <div className="button-group">
        <form action={confirmAction}>
          <button type="submit" className="btn btn-danger">
            Yes, Delete Permanently
          </button>
        </form>
        <LinkButton href={returnUrl} variant="secondary">
          No, Cancel
        </LinkButton>
      </div>
    </div>
  );
}
