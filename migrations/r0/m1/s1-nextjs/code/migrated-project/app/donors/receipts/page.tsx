import { getDonorsEligibleForReceipt } from "@/lib/repositories/donors";
import { DonorSelectTable } from "@/components/donors/DonorTable";
import { DonorsSubnav } from "@/components/layout/Subnav";
import { FlashMessages } from "@/components/ui/FlashMessages";
import { PageIntro } from "@/components/ui/Table";

export default async function TaxReceiptsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const params = await searchParams;
  const donors = await getDonorsEligibleForReceipt();

  return (
    <>
      <DonorsSubnav activeKey="receipts" />
      <FlashMessages success={params.success} error={params.error} />
      <PageIntro>
        Select donors with donated items who have not yet received a tax receipt.
      </PageIntro>
      <DonorSelectTable
        donors={donors}
        formAction="/api/donors/receipts"
        submitLabel="Generate Tax Receipts"
      />
    </>
  );
}
