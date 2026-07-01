import Link from "next/link";
import { saveLotAction } from "@/lib/actions/lot.actions";
import type { Bidder, Category, Lot } from "@/lib/types";

export function LotForm({
  lot,
  categories,
  bidders,
}: {
  lot?: Lot;
  categories: Category[];
  bidders: Bidder[];
}) {
  return (
    <form className="c-form" action={saveLotAction}>
      {lot ? <input type="hidden" name="LotID" value={lot.LotID} /> : null}
      <div className="c-form__field">
        <label htmlFor="Description">Description</label>
        <input
          type="text"
          id="Description"
          name="Description"
          required
          defaultValue={lot?.Description ?? ""}
        />
      </div>
      <div className="c-form__field">
        <label htmlFor="CategoryID">Category</label>
        <select
          id="CategoryID"
          name="CategoryID"
          defaultValue={lot?.CategoryID ?? ""}
        >
          <option value="">None</option>
          {categories.map((cat) => (
            <option key={cat.CategoryID} value={cat.CategoryID}>
              {cat.Description}
            </option>
          ))}
        </select>
      </div>
      <div className="c-form__field">
        <label htmlFor="HighestBid">Highest Bid</label>
        <input
          type="number"
          id="HighestBid"
          name="HighestBid"
          step="0.01"
          placeholder="No highest bid yet"
          defaultValue={lot?.WinningBid ?? ""}
        />
      </div>
      <div className="c-form__field">
        <label htmlFor="BidderID">Bidder</label>
        <select
          id="BidderID"
          name="BidderID"
          defaultValue={lot?.WinningBidder ?? ""}
        >
          <option value="">None</option>
          {bidders.map((bidder) => (
            <option key={bidder.BidderID} value={bidder.BidderID}>
              {bidder.Name}
            </option>
          ))}
        </select>
      </div>
      <div className="c-form__field u-flex-row">
        <input
          type="checkbox"
          id="Delivered"
          name="Delivered"
          defaultChecked={Boolean(lot?.Delivered)}
        />
        <label htmlFor="Delivered">Delivered</label>
      </div>
      <div className="c-form__field">
        <label htmlFor="Image">Image URL</label>
        <input
          type="text"
          id="Image"
          name="Image"
          placeholder="Image URL"
          defaultValue={lot?.Image ?? ""}
        />
      </div>
      <div className="o-flex u-gap-space-200" style={{ marginTop: "var(--space-300)" }}>
        <button type="submit" className="btn btn-success">
          {lot ? "Update" : "Add Lot"}
        </button>
        <Link href="/lots" className="btn btn-secondary">
          Cancel
        </Link>
      </div>
    </form>
  );
}
