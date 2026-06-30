import { getDonorsWithoutReceipt } from "@/lib/repositories/donors";
import { DonorTable } from "@/components/donors/DonorTable";
import { DonorsSubnav } from "@/components/layout/Subnav";
import { FlashMessages } from "@/components/ui/FlashMessages";
import { PageIntro } from "@/components/ui/Table";

export default async function PendingReceiptsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const params = await searchParams;
  const donors = await getDonorsWithoutReceipt();

  return (
    <>
      <DonorsSubnav activeKey="pending" />
      <FlashMessages success={params.success} error={params.error} />
      <PageIntro>
        Donors with donated items who have not yet received a tax receipt.
      </PageIntro>
      <DonorTable donors={donors} showReceiptColumns />
    </>
  );
}
