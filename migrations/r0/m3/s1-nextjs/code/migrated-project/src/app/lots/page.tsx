import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { LotsSubnav } from "@/components/layout/LotsSubnav";
import { LotsTable } from "@/components/lots/Tables";
import { FlashAlert } from "@/components/ui/FlashAlert";
import * as lotService from "@/lib/services/lot.service";

export default async function LotsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const params = await searchParams;
  const lots = await lotService.listLots();

  return (
    <AppShell activeSection="lots">
      <LotsSubnav
        active="lots"
        actions={
          <Link href="/lots/new" className="btn btn-success">
            Add New Lot
          </Link>
        }
      />
      <FlashAlert success={params.success} error={params.error} />
      <LotsTable lots={lots} />
    </AppShell>
  );
}
