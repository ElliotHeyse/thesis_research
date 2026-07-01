import { DonorsSubnav } from "@/components/layout/DonorsSubnav";
import { FlashMessages } from "@/components/layout/FlashMessages";
import { DonorCheckboxTable } from "@/components/ui/DonorsTable";
import { getDonorsEligibleForReceipt } from "@/lib/db/donors";

export default async function DonorReceiptsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const donors = await getDonorsEligibleForReceipt();

  return (
    <>
      <DonorsSubnav pathname="/donors/receipts" />
      <FlashMessages error={params.error} />
      <DonorCheckboxTable
        donors={donors}
        formAction="/api/pdf/receipts"
        submitLabel="Generate Tax Receipts"
      />
    </>
  );
}
