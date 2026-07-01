import { AppShell } from "@/components/layout/AppShell";
import { DonorsSubnav } from "@/components/layout/DonorsSubnav";
import { DonorTable } from "@/components/donors/DonorTable";
import { FlashAlert } from "@/components/ui/FlashAlert";
import * as donorService from "@/lib/services/donor.service";

export default async function PendingReceiptsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const params = await searchParams;
  const donors = await donorService.listPendingReceipts();

  return (
    <AppShell activeSection="donors">
      <DonorsSubnav active="pending" />
      <FlashAlert success={params.success} error={params.error} />
      <p className="c-page-intro">
        Donors with donated items who have not yet received a tax receipt.
      </p>
      <DonorTable donors={donors} showReceiptColumns />
    </AppShell>
  );
}
