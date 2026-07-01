import { AppShell } from "@/components/layout/AppShell";
import { LotsSubnav } from "@/components/layout/LotsSubnav";
import { LotForm } from "@/components/lots/LotForm";
import { FlashAlert } from "@/components/ui/FlashAlert";
import * as lotService from "@/lib/services/lot.service";

export default async function NewLotPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;
  const [categories, bidders] = await Promise.all([
    lotService.listCategoriesForSelect(),
    lotService.listBiddersForSelect(),
  ]);

  return (
    <AppShell activeSection="lots">
      <LotsSubnav active="lots" />
      <FlashAlert error={sp.error} />
      <h2 style={{ color: "var(--gray-900)", marginBottom: "var(--space-200)" }}>
        Add Lot
      </h2>
      <LotForm categories={categories} bidders={bidders} />
    </AppShell>
  );
}
