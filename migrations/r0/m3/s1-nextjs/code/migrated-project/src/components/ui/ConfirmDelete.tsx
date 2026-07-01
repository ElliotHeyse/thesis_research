import Link from "next/link";
import { formatCurrency, formatYesNo } from "@/lib/utils/format";

const ENTITY_FIELDS: Record<
  string,
  { label: string; key: string; format?: "currency" }[]
> = {
  donor: [
    { label: "Donor ID", key: "DonorID" },
    { label: "Business Name", key: "BusinessName" },
    { label: "Contact Name", key: "ContactName" },
    { label: "Email", key: "ContactEmail" },
    { label: "City", key: "City" },
  ],
  item: [
    { label: "Item ID", key: "ItemID" },
    { label: "Description", key: "Description" },
    { label: "Retail Value", key: "RetailValue", format: "currency" },
    { label: "Donor ID", key: "DonorID" },
  ],
  lot: [
    { label: "Lot ID", key: "LotID" },
    { label: "Description", key: "Description" },
    { label: "Category ID", key: "CategoryID" },
  ],
  category: [
    { label: "Category ID", key: "CategoryID" },
    { label: "Description", key: "Description" },
  ],
};

function formatValue(
  entity: Record<string, unknown>,
  field: { key: string; format?: "currency" },
): string {
  const value = entity[field.key];
  if (field.format === "currency") return formatCurrency(value);
  return String(value ?? "N/A");
}

export function ConfirmDelete({
  entityType,
  entity,
  cancelHref,
  deleteAction,
}: {
  entityType: keyof typeof ENTITY_FIELDS;
  entity: Record<string, unknown>;
  cancelHref: string;
  deleteAction?: () => Promise<void>;
}) {
  const fields = ENTITY_FIELDS[entityType] ?? [];

  return (
    <div className="confirm-container">
      <h2 className="confirm-title">Confirm Deletion</h2>
      <p style={{ textAlign: "center", marginBottom: 30 }}>
        <strong>Are you sure you want to delete this {entityType}?</strong>
        <br />
        This action cannot be undone.
      </p>
      <div className="entity-details">
        {fields.map((field) => (
          <p key={field.key}>
            <strong>{field.label}:</strong> {formatValue(entity, field)}
          </p>
        ))}
      </div>
      <div className="button-group" style={{ marginTop: 30, textAlign: "center" }}>
        {deleteAction ? (
          <form action={deleteAction} style={{ display: "inline" }}>
            <button type="submit" className="btn btn-danger">
              Yes, Delete Permanently
            </button>
          </form>
        ) : null}{" "}
        <Link href={cancelHref} className="btn btn-secondary">
          No, Cancel
        </Link>
      </div>
    </div>
  );
}

export function LotDetailsView({
  lot,
  categoryDescription,
}: {
  lot: {
    LotID: number;
    Description: string;
    WinningBid: number | null;
    Winner?: string | null;
    Delivered: boolean | number;
    Image?: string | null;
  };
  categoryDescription?: string;
}) {
  const delivered = Boolean(lot.Delivered);

  return (
    <div className="c-lot-details">
      <h3 className="c-lot-details__title">Lot {lot.LotID}</h3>
      <div className="c-lot-details__content">
        {lot.Image ? (
          <div className="c-lot-details__image-wrapper">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={lot.Image} alt="Lot Image" className="c-lot-details__image" />
          </div>
        ) : null}
        <div className="c-lot-details__info">
          <DetailField label="Description" value={lot.Description} />
          <DetailField label="Highest Bid" value={formatCurrency(lot.WinningBid)} />
          <DetailField
            label="Winner"
            value={lot.Winner ?? "No winner yet"}
          />
          <DetailField
            label="Delivered"
            value={formatYesNo(delivered)}
            modifier={delivered ? "--yes" : "--no"}
          />
          <DetailField label="Category" value={categoryDescription ?? "-"} />
        </div>
      </div>
    </div>
  );
}

function DetailField({
  label,
  value,
  modifier,
}: {
  label: string;
  value: string;
  modifier?: string;
}) {
  return (
    <div className="c-lot-details__field">
      <span className="c-lot-details__label">{label}</span>
      <span
        className={`c-lot-details__value${modifier ? ` c-lot-details__value${modifier}` : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
