import { AppShell } from "@/components/layout/AppShell";
import { DonorsSubnav } from "@/components/layout/DonorsSubnav";
import { DonorSelectTable } from "@/components/donors/DonorTable";
import { FlashAlert } from "@/components/ui/FlashAlert";
import * as donorService from "@/lib/services/donor.service";

export default async function DonorReceiptsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const params = await searchParams;
  const donors = await donorService.listEligibleForReceipt();

  return (
    <AppShell activeSection="donors">
      <DonorsSubnav active="receipts" />
      <FlashAlert success={params.success} error={params.error} />
      <p className="c-page-intro">
        Select eligible donors to generate tax receipts. Donors will be marked as
        receipt sent after generation.
      </p>
      <DonorSelectTable
        donors={donors}
        formAction="/api/donors/receipts"
        submitLabel="Generate Tax Receipts"
      />
    </AppShell>
  );
}
