import Link from "next/link";
import { saveItemAction } from "@/lib/actions/item.actions";
import type { DonorSelect, Item, LotDescription } from "@/lib/types";
import { donorDisplayName } from "@/lib/utils/format";

export function ItemForm({
  item,
  donors,
  lots,
}: {
  item?: Item;
  donors: DonorSelect[];
  lots: LotDescription[];
}) {
  return (
    <form className="c-form" action={saveItemAction}>
      {item ? <input type="hidden" name="ItemID" value={item.ItemID} /> : null}
      <div className="c-form__field">
        <label htmlFor="Description">Description</label>
        <input
          type="text"
          id="Description"
          name="Description"
          maxLength={75}
          required
          defaultValue={item?.Description ?? ""}
        />
      </div>
      <div className="c-form__field">
        <label htmlFor="RetailValue">Retail Value</label>
        <input
          type="number"
          id="RetailValue"
          name="RetailValue"
          step="0.01"
          required
          defaultValue={item?.RetailValue ?? ""}
        />
      </div>
      <div className="c-form__field">
        <label htmlFor="DonorID">Donor</label>
        <select id="DonorID" name="DonorID" required defaultValue={item?.DonorID ?? ""}>
          <option value="">Select donor</option>
          {donors.map((donor) => {
            let label = donorDisplayName(donor);
            if (donor.ContactName && label !== donor.ContactName) {
              label += ` (${donor.ContactName})`;
            } else if (donor.ContactName) {
              label = donor.ContactName;
            }
            return (
              <option key={donor.DonorID} value={donor.DonorID}>
                {label}
              </option>
            );
          })}
        </select>
      </div>
      <div className="c-form__field">
        <label htmlFor="LotID">Lot (optional)</label>
        <select id="LotID" name="LotID" defaultValue={item?.LotID ?? -1}>
          <option value="-1">--- No lot selected ---</option>
          {lots.map((lot) => (
            <option key={lot.LotID} value={lot.LotID}>
              {lot.Description}
            </option>
          ))}
        </select>
      </div>
      <div className="o-flex u-gap-space-200" style={{ marginTop: "var(--space-300)" }}>
        <button type="submit" className="btn btn-success">
          {item ? "Update Item" : "Add Item"}
        </button>
        <Link href="/lots/items" className="btn btn-secondary">
          Cancel
        </Link>
      </div>
    </form>
  );
}
