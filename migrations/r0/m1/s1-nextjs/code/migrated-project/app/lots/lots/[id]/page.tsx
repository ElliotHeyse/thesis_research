import { notFound } from "next/navigation";
import { getLotDetail } from "@/lib/repositories/lots";
import { LotDetailsView } from "@/components/lots/LotDetailsView";
import { LotsSubnav } from "@/components/layout/Subnav";

export default async function LotDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lotId = Number(id);
  const lot = await getLotDetail(lotId);

  if (!lot) {
    notFound();
  }

  return (
    <>
      <LotsSubnav activeKey="lots" />
      <LotDetailsView lot={lot} />
    </>
  );
}
