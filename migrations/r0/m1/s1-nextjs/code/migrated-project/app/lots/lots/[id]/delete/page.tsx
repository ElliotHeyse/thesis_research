import { notFound } from "next/navigation";
import { getLot } from "@/lib/repositories/lots";
import { confirmDeleteLotAction } from "@/lib/actions/lots";
import { LotsSubnav } from "@/components/layout/Subnav";
import { ConfirmDelete } from "@/components/ui/ConfirmDelete";

export default async function DeleteLotPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lotId = Number(id);
  const lot = await getLot(lotId);

  if (!lot) {
    notFound();
  }

  return (
    <>
      <LotsSubnav activeKey="lots" />
      <ConfirmDelete
        entityType="lot"
        entity={lot as unknown as Record<string, unknown>}
        returnUrl={`/lots/lots/${lotId}/edit`}
        confirmAction={confirmDeleteLotAction.bind(null, lotId)}
      />
    </>
  );
}
