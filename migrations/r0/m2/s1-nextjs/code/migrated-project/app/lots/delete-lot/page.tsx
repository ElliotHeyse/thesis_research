import Link from "next/link";
import { redirect } from "next/navigation";
import { LotsSubnav } from "@/components/layout/LotsSubnav";
import { formatOrDash } from "@/lib/format";
import { getLot } from "@/lib/db/items";
import { deleteLotAction } from "../actions";

export default async function DeleteLotPage({
  searchParams,
}: {
  searchParams: Promise<{ LotID?: string; confirm?: string }>;
}) {
  const params = await searchParams;
  const lotId = params.LotID ? Number(params.LotID) : null;

  if (!lotId) redirect("/lots/lots?error=invalid_id");

  const lot = await getLot(lotId);
  if (!lot) redirect("/lots/lots?error=notfound");

  if (params.confirm === "1") {
    await deleteLotAction(lotId);
  }

  return (
    <>
      <LotsSubnav pathname="/lots/delete-lot" lotId={lotId} />
      <div className="o-flex o-flex--column u-gap-space-200">
        <h2>Confirm Deletion</h2>
        <p style={{ textAlign: "center", marginBottom: "30px" }}>
          <strong>Are you sure you want to delete this lot?</strong>
          <br />
          This action cannot be undone.
        </p>
        <div>
          <p>
            <strong>Lot ID:</strong> {lot.LotID}
          </p>
          <p>
            <strong>Description:</strong> {formatOrDash(lot.Description)}
          </p>
          <p>
            <strong>Category ID:</strong> {formatOrDash(lot.CategoryID)}
          </p>
        </div>
        <div className="o-flex u-gap-space-100">
          <Link
            href={`/lots/delete-lot?LotID=${lotId}&confirm=1`}
            className="btn btn-danger"
          >
            Yes, Delete Permanently
          </Link>
          <Link href="/lots/lots" className="btn btn-secondary">
            No, Cancel
          </Link>
        </div>
      </div>
    </>
  );
}
