import { DonorsSubnav } from "@/components/layout/DonorsSubnav";
import { FlashMessages } from "@/components/layout/FlashMessages";
import { DonorsTable } from "@/components/ui/DonorsTable";
import { getDonors } from "@/lib/db/donors";

export default async function DonorsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const params = await searchParams;
  const donors = await getDonors();

  return (
    <>
      <DonorsSubnav pathname="/donors" />
      <FlashMessages success={params.success} error={params.error} />
      <DonorsTable donors={donors} />
    </>
  );
}
