import { getDonors } from "@/lib/repositories/donors";
import { DonorTable } from "@/components/donors/DonorTable";
import { DonorsSubnav, DonorsListActions } from "@/components/layout/Subnav";
import { FlashMessages } from "@/components/ui/FlashMessages";

export default async function DonorsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const params = await searchParams;
  const donors = await getDonors();

  return (
    <>
      <DonorsSubnav activeKey="donors" actions={<DonorsListActions />} />
      <FlashMessages success={params.success} error={params.error} />
      <DonorTable donors={donors} />
    </>
  );
}
