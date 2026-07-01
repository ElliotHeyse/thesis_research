import Link from "next/link";
import { redirect } from "next/navigation";
import { LotsSubnav } from "@/components/layout/LotsSubnav";
import { formatCurrency, formatOrDash } from "@/lib/format";
import { getItemById } from "@/lib/db/items";
import { deleteItemAction } from "../actions";

export default async function DeleteItemPage({
  searchParams,
}: {
  searchParams: Promise<{ ItemID?: string; confirm?: string }>;
}) {
  const params = await searchParams;
  const itemId = params.ItemID ? Number(params.ItemID) : null;

  if (!itemId) redirect("/lots/items?error=invalid_id");

  const item = await getItemById(itemId);
  if (!item) redirect("/lots/items?error=notfound");

  if (params.confirm === "1") {
    await deleteItemAction(itemId);
  }

  return (
    <>
      <LotsSubnav pathname="/lots/delete-item" />
      <div className="o-flex o-flex--column u-gap-space-200">
        <h2>Confirm Deletion</h2>
        <p style={{ textAlign: "center", marginBottom: "30px" }}>
          <strong>Are you sure you want to delete this item?</strong>
          <br />
          This action cannot be undone.
        </p>
        <div>
          <p>
            <strong>Item ID:</strong> {item.ItemID}
          </p>
          <p>
            <strong>Description:</strong> {formatOrDash(item.Description)}
          </p>
          <p>
            <strong>Retail Value:</strong>{" "}
            {formatCurrency(item.RetailValue)}
          </p>
          <p>
            <strong>Donor ID:</strong> {item.DonorID}
          </p>
        </div>
        <div className="o-flex u-gap-space-100">
          <Link
            href={`/lots/delete-item?ItemID=${itemId}&confirm=1`}
            className="btn btn-danger"
          >
            Yes, Delete Permanently
          </Link>
          <Link href="/lots/items" className="btn btn-secondary">
            No, Cancel
          </Link>
        </div>
      </div>
    </>
  );
}
