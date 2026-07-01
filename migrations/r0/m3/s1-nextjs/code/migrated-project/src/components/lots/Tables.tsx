import Link from "next/link";
import type { Item, Lot, LotDescription } from "@/lib/types";
import { formatCurrency, formatOrDash, formatYesNo } from "@/lib/utils/format";
import { bulkAssignLotsAction } from "@/lib/actions/item.actions";

function LotSelect({
  lots,
  itemId,
  activeLotId,
}: {
  lots: LotDescription[];
  itemId: number;
  activeLotId: number | null;
}) {
  const value = activeLotId ?? -1;
  return (
    <select name={`LotID[${itemId}]`} className="form-control-inline" defaultValue={value}>
      <option value="-1">--- No lot selected ---</option>
      {lots.map((lot) => (
        <option key={lot.LotID} value={lot.LotID}>
          {lot.Description}
        </option>
      ))}
    </select>
  );
}

export function ItemsTable({
  items,
  lots,
}: {
  items: Item[];
  lots: LotDescription[];
}) {
  if (items.length === 0) {
    return <p className="c-empty-state">No items found</p>;
  }

  return (
    <form id="items-lot-form" action={bulkAssignLotsAction}>
      <table className="template-table">
        <thead>
          <tr>
            <th>Item ID</th>
            <th>Description</th>
            <th>Retail Value</th>
            <th>Donor</th>
            <th>Lot</th>
            <th>Actions</th>
            <th>Download Bidding Sheet</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.ItemID}>
              <td>{item.ItemID}</td>
              <td>{formatOrDash(item.Description)}</td>
              <td>{formatOrDash(item.RetailValue)}</td>
              <td>{formatOrDash(item.BusinessName)}</td>
              <td>
                <LotSelect lots={lots} itemId={item.ItemID} activeLotId={item.LotID} />
              </td>
              <td>
                <Link href={`/lots/items/${item.ItemID}/edit`} className="btn-edit">
                  Edit
                </Link>{" "}
                <Link href={`/lots/items/${item.ItemID}/delete`} className="btn-delete">
                  Delete
                </Link>
              </td>
              <td>
                <a
                  href={`/api/items/${item.ItemID}/bidding-sheet`}
                  className="btn btn-success"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download Bidding Sheet
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </form>
  );
}

export function LotsTable({ lots }: { lots: Lot[] }) {
  if (lots.length === 0) {
    return <p className="c-empty-state">No lots found</p>;
  }

  return (
    <table className="template-table">
      <thead>
        <tr>
          <th>Lot ID</th>
          <th>Description</th>
          <th>Highest Bid</th>
          <th>Winner</th>
          <th>Delivered</th>
          <th>Category</th>
          <th>Edit Lot</th>
          <th>View Lot</th>
        </tr>
      </thead>
      <tbody>
        {lots.map((lot) => (
          <tr key={lot.LotID}>
            <td>{lot.LotID}</td>
            <td>{formatOrDash(lot.Description)}</td>
            <td>{formatCurrency(lot.WinningBid)}</td>
            <td>{formatOrDash(lot.Winner)}</td>
            <td>{formatYesNo(lot.Delivered)}</td>
            <td>{formatOrDash(lot.Category)}</td>
            <td>
              <Link href={`/lots/${lot.LotID}/edit`}>Edit</Link>
            </td>
            <td>
              <Link href={`/lots/${lot.LotID}`}>View</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function CategoriesTable({
  categories,
}: {
  categories: { CategoryID: number; Description: string }[];
}) {
  if (categories.length === 0) {
    return <p className="c-empty-state">No categories found</p>;
  }

  return (
    <table className="template-table">
      <thead>
        <tr>
          <th>Category ID</th>
          <th>Description</th>
          <th>Edit Category</th>
        </tr>
      </thead>
      <tbody>
        {categories.map((cat) => (
          <tr key={cat.CategoryID}>
            <td>{cat.CategoryID}</td>
            <td>{formatOrDash(cat.Description)}</td>
            <td>
              <Link href={`/lots/categories/${cat.CategoryID}/edit`}>Edit</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
