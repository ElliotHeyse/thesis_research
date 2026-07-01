import { DonorsSubnav } from "@/components/layout/DonorsSubnav";
import { DonorsTable } from "@/components/ui/DonorsTable";
import { getDonorsWithoutReceipt } from "@/lib/db/donors";

export default async function PendingReceiptsPage() {
  const donors = await getDonorsWithoutReceipt();

  return (
    <>
      <DonorsSubnav pathname="/donors/pending-receipts" />
      <DonorsTable donors={donors} showReceiptColumns />
    </>
  );
}
