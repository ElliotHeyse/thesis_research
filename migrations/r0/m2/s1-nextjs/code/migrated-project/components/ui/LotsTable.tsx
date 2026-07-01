import Link from "next/link";
import {
  formatCurrency,
  formatOrDash,
  formatYesNo,
} from "@/lib/format";
import type {
  Category,
  ItemListRow,
  Lot,
  LotListRow,
} from "@/lib/db/types";
import { ActionLinks } from "./ActionLinks";
import { DataTable } from "./DataTable";

interface ItemsTableProps {
  items: ItemListRow[];
  lotDescriptions: Pick<Lot, "LotID" | "Description">[];
}

function LotSelect({
  lots,
  itemId,
  currentLotId,
}: {
  lots: Pick<Lot, "LotID" | "Description">[];
  itemId: number;
  currentLotId: number | null;
}) {
  const value = currentLotId ?? -1;
  return (
    <select name={`LotID[${itemId}]`} defaultValue={value}>
      <option value={-1}>— Unassigned —</option>
      {lots.map((lot) => (
        <option key={lot.LotID} value={lot.LotID}>
          {lot.Description}
        </option>
      ))}
    </select>
  );
}

export function ItemsTable({ items, lotDescriptions }: ItemsTableProps) {
  const table = (
    <DataTable
      empty={items.length === 0}
      emptyMessage="No items found"
      head={
        <tr>
          <th>Item ID</th>
          <th>Description</th>
          <th>Retail Value</th>
          <th>Donor</th>
          <th>Lot</th>
          <th>Actions</th>
          <th>Download Bidding Sheet</th>
        </tr>
      }
    >
      {items.map((item) => (
        <tr key={item.ItemID}>
          <td>{item.ItemID}</td>
          <td>{formatOrDash(item.Description)}</td>
          <td>{formatOrDash(item.RetailValue)}</td>
          <td>{formatOrDash(item.BusinessName)}</td>
          <td>
            <LotSelect
              lots={lotDescriptions}
              itemId={item.ItemID}
              currentLotId={item.LotID}
            />
          </td>
          <td>
            <ActionLinks
              links={{
                Edit: `/lots/edit-item?ItemID=${item.ItemID}`,
                Delete: `/lots/delete-item?ItemID=${item.ItemID}`,
              }}
            />
          </td>
          <td>
            <Link
              href={`/api/pdf/bidding-sheet?ItemID=${item.ItemID}`}
              className="btn btn-success"
              target="_blank"
            >
              Download Bidding Sheet
            </Link>
          </td>
        </tr>
      ))}
    </DataTable>
  );

  return table;
}

export function LotsTable({ lots }: { lots: LotListRow[] }) {
  return (
    <DataTable
      empty={lots.length === 0}
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
            <Link href={`/lots/edit-lot?LotID=${lot.LotID}`}>Edit</Link>
          </td>
          <td>
            <Link href={`/lots/lot-details?LotID=${lot.LotID}`}>View</Link>
          </td>
        </tr>
      ))}
    </DataTable>
  );
}

export function CategoriesTable({ categories }: { categories: Category[] }) {
  return (
    <DataTable
      empty={categories.length === 0}
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
            <Link
              href={`/lots/edit-category?CategoryID=${category.CategoryID}`}
            >
              Edit
            </Link>
          </td>
        </tr>
      ))}
    </DataTable>
  );
}
