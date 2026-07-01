import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { LotsSubnav } from "@/components/layout/LotsSubnav";
import { LotDetailsView } from "@/components/ui/ConfirmDelete";
import * as lotService from "@/lib/services/lot.service";

export default async function LotDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detail = await lotService.getLotDetail(Number(id));
  if (!detail) notFound();

  return (
    <AppShell activeSection="lots">
      <LotsSubnav active="lots" />
      <LotDetailsView
        lot={detail.lot}
        categoryDescription={detail.category?.Description}
      />
    </AppShell>
  );
}
