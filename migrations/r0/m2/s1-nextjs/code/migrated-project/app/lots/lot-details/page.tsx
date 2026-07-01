import { redirect } from "next/navigation";
import { LotsSubnav } from "@/components/layout/LotsSubnav";
import { LotDetailsView } from "@/components/ui/ConfirmDelete";
import { getLot } from "@/lib/db/items";

export default async function LotDetailsPage({
  searchParams,
}: {
  searchParams: Promise<{ LotID?: string }>;
}) {
  const params = await searchParams;
  const lotId = params.LotID ? Number(params.LotID) : null;

  if (!lotId) redirect("/lots/lots?error=invalid_id");

  const lot = await getLot(lotId);
  if (!lot) redirect("/lots/lots?error=notfound");

  return (
    <>
      <LotsSubnav pathname="/lots/lot-details" />
      <LotDetailsView lot={lot} />
    </>
  );
}
