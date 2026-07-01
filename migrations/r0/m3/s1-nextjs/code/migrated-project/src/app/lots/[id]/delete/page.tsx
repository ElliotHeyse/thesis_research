import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { LotsSubnav } from "@/components/layout/LotsSubnav";
import { ConfirmDelete } from "@/components/ui/ConfirmDelete";
import { deleteLotAction } from "@/lib/actions/lot.actions";
import * as lotService from "@/lib/services/lot.service";

export default async function DeleteLotPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lotId = Number(id);
  const lot = await lotService.getLot(lotId);
  if (!lot) notFound();

  return (
    <AppShell activeSection="lots">
      <LotsSubnav active="lots" />
      <ConfirmDelete
        entityType="lot"
        entity={lot as unknown as Record<string, unknown>}
        cancelHref="/lots"
        deleteAction={deleteLotAction.bind(null, lotId)}
      />
    </AppShell>
  );
}
