import { notFound } from "next/navigation";
import { getCategories } from "@/lib/repositories/categories";
import { getLot, getBidders } from "@/lib/repositories/lots";
import { LotForm } from "@/components/lots/LotForms";
import { LotsSubnav } from "@/components/layout/Subnav";
import { LinkButton } from "@/components/ui/Button";

export default async function EditLotPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lotId = Number(id);
  const [lot, categories, bidders] = await Promise.all([
    getLot(lotId),
    getCategories(),
    getBidders(),
  ]);

  if (!lot) {
    notFound();
  }

  return (
    <>
      <LotsSubnav
        activeKey="lots"
        actions={
          <LinkButton href={`/lots/lots/${lotId}/delete`} variant="danger">
            Delete Lot
          </LinkButton>
        }
      />
      <LotForm
        lotId={lotId}
        initialValues={{
          description: lot.Description ?? "",
          categoryId: lot.CategoryID ? String(lot.CategoryID) : "",
          highestBid: lot.WinningBid ? String(lot.WinningBid) : "",
          bidderId: lot.WinningBidder ? String(lot.WinningBidder) : "",
          delivered: Boolean(lot.Delivered),
          image: lot.Image ?? "",
        }}
        categories={categories}
        bidders={bidders}
      />
    </>
  );
}
