import { formatCurrency, formatYesNo } from "@/lib/format";
import type { LotDetail } from "@/lib/types";

export function LotDetailsView({ lot }: { lot: LotDetail }) {
  const delivered = Boolean(lot.Delivered);

  return (
    <div className="c-lot-details o-container">
      <h3 className="c-lot-details__title">Lot {lot.LotID}</h3>
      <div className="c-lot-details__content">
        {lot.Image && (
          <div className="c-lot-details__image-wrapper">
            <img
              src={lot.Image}
              alt="Lot Image"
              className="c-lot-details__image"
            />
          </div>
        )}
        <div className="c-lot-details__info">
          <DetailField label="Description" value={lot.Description} />
          <DetailField
            label="Highest Bid"
            value={formatCurrency(lot.WinningBid ?? 0)}
          />
          <DetailField
            label="Winner"
            value={lot.Winner ?? "No winner yet"}
          />
          <DetailField
            label="Delivered"
            value={formatYesNo(delivered)}
            modifier={delivered ? "--yes" : "--no"}
          />
          <DetailField
            label="Category"
            value={lot.CategoryDescription ?? ""}
          />
        </div>
      </div>
    </div>
  );
}

function DetailField({
  label,
  value,
  modifier = "",
}: {
  label: string;
  value: string;
  modifier?: string;
}) {
  return (
    <div className="c-lot-details__field">
      <span className="c-lot-details__label">{label}</span>
      <span className={`c-lot-details__value c-lot-details__value${modifier}`}>
        {value}
      </span>
    </div>
  );
}
