import { formatCurrency, formatOrDash, formatYesNo } from "@/lib/format";
import type { Category, Item, Lot, LotListRow } from "@/lib/types";
import { ActionLinks, LinkButton } from "@/components/ui/Button";
import { DataTable, EmptyState } from "@/components/ui/Table";
import { saveLotAssignmentsAction } from "@/lib/actions/items";

function LotSelect({
  lots,
  itemId,
  activeLotId,
}: {
  lots: Pick<Lot, "LotID" | "Description">[];
  itemId: number;
  activeLotId: number | null;
}) {
  const value = activeLotId ?? -1;
  return (
    <select
      name={`lotId_${itemId}`}
      defaultValue={String(value)}
      className="form-control-inline"
    >
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
  lots: Pick<Lot, "LotID" | "Description">[];
}) {
  if (items.length === 0) {
    return <EmptyState message="No items found" />;
  }

  return (
    <form id="items-lot-form" action={saveLotAssignmentsAction}>
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
                <LotSelect
                  lots={lots}
                  itemId={item.ItemID}
                  activeLotId={item.LotID}
                />
              </td>
              <td>
                <ActionLinks
                  links={{
                    Edit: `/lots/items/${item.ItemID}/edit`,
                    Delete: `/lots/items/${item.ItemID}/delete`,
                  }}
                />
              </td>
              <td>
                <LinkButton
                  href={`/api/lots/bidding-sheet?itemId=${item.ItemID}`}
                  variant="success"
                  target="_blank"
                >
                  Download Bidding Sheet
                </LinkButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </form>
  );
}

export function LotsTable({ lots }: { lots: LotListRow[] }) {
  return (
    <DataTable
      isEmpty={lots.length === 0}
      emptyMessage="No lots found"
      head={
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
      }
    >
      {lots.map((lot) => (
        <tr key={lot.LotID}>
          <td>{lot.LotID}</td>
          <td>{formatOrDash(lot.Description)}</td>
          <td>{formatCurrency(lot.WinningBid)}</td>
          <td>{formatOrDash(lot.Winner)}</td>
          <td>{formatYesNo(lot.Delivered)}</td>
          <td>{formatOrDash(lot.Category)}</td>
          <td>
            <a href={`/lots/lots/${lot.LotID}/edit`}>Edit</a>
          </td>
          <td>
            <a href={`/lots/lots/${lot.LotID}`}>View</a>
          </td>
        </tr>
      ))}
    </DataTable>
  );
}

export function CategoriesTable({ categories }: { categories: Category[] }) {
  return (
    <DataTable
      isEmpty={categories.length === 0}
      emptyMessage="No categories found"
      head={
        <tr>
          <th>Category ID</th>
          <th>Description</th>
          <th>Edit Category</th>
        </tr>
      }
    >
      {categories.map((category) => (
        <tr key={category.CategoryID}>
          <td>{category.CategoryID}</td>
          <td>{formatOrDash(category.Description)}</td>
          <td>
            <a href={`/lots/categories/${category.CategoryID}/edit`}>Edit</a>
          </td>
        </tr>
      ))}
    </DataTable>
  );
}
