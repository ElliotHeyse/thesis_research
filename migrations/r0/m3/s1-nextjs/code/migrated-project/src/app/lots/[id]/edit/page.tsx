import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { LotsSubnav } from "@/components/layout/LotsSubnav";
import { LotForm } from "@/components/lots/LotForm";
import { FlashAlert } from "@/components/ui/FlashAlert";
import * as lotService from "@/lib/services/lot.service";

export default async function EditLotPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const lot = await lotService.getLot(Number(id));
  if (!lot) notFound();

  const [categories, bidders] = await Promise.all([
    lotService.listCategoriesForSelect(),
    lotService.listBiddersForSelect(),
  ]);

  return (
    <AppShell activeSection="lots">
      <LotsSubnav
        active="lots"
        actions={
          <Link href={`/lots/${id}/delete`} className="btn btn-danger">
            Delete Lot
          </Link>
        }
      />
      <FlashAlert error={sp.error} />
      <h2 style={{ color: "var(--gray-900)", marginBottom: "var(--space-200)" }}>
        Edit Lot
      </h2>
      <LotForm lot={lot} categories={categories} bidders={bidders} />
    </AppShell>
  );
}
