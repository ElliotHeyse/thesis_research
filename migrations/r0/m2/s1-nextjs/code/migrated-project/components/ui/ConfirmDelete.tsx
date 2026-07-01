import Link from "next/link";
import { formatCurrency, formatOrDash, formatYesNo } from "@/lib/format";
import type { LotDetail } from "@/lib/db/types";

interface ConfirmDeleteProps {
  entityType: string;
  entityLabel: string;
  returnHref: string;
  confirmHref: string;
}

export function ConfirmDelete({
  entityType,
  entityLabel,
  returnHref,
  confirmHref,
}: ConfirmDeleteProps) {
  return (
    <div className="o-flex o-flex--column u-gap-space-200">
      <h2>Delete {entityType}</h2>
      <p>
        Are you sure you want to delete <strong>{entityLabel}</strong>?
      </p>
      <div className="o-flex u-gap-space-100">
        <Link href={confirmHref} className="btn btn-danger">
          Confirm Delete
        </Link>
        <Link href={returnHref} className="btn btn-secondary">
          Cancel
        </Link>
      </div>
    </div>
  );
}

export function LotDetailsView({
  lot,
  categoryDescription,
}: {
  lot: LotDetail;
  categoryDescription?: string | null;
}) {
  const winner = lot.Winner ?? "No winner yet";

  return (
    <div className="c-lot-details">
      <h1 className="c-lot-details__title">{lot.Description}</h1>
      <div className="c-lot-details__content">
        {lot.Image && (
          <div className="c-lot-details__image-wrapper">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lot.Image}
              alt={lot.Description}
              className="c-lot-details__image"
            />
          </div>
        )}
        <div className="c-lot-details__info">
          <DetailField label="Lot ID" value={String(lot.LotID)} />
          <DetailField
            label="Category"
            value={formatOrDash(categoryDescription ?? lot.CategoryDescription)}
          />
          <DetailField
            label="Highest Bid"
            value={formatCurrency(lot.WinningBid)}
          />
          <DetailField label="Winner" value={formatOrDash(winner)} />
          <DetailField
            label="Delivered"
            value={formatYesNo(lot.Delivered)}
            modifier={lot.Delivered ? "yes" : "no"}
          />
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
  modifier?: "yes" | "no";
}) {
  const valueClass =
    modifier === "yes"
      ? "c-lot-details__value c-lot-details__value--yes"
      : modifier === "no"
        ? "c-lot-details__value c-lot-details__value--no"
        : "c-lot-details__value";

  return (
    <div className="c-lot-details__field">
      <span className="c-lot-details__label">{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  );
}
