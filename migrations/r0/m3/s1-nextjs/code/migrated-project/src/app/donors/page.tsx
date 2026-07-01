import { AppShell } from "@/components/layout/AppShell";
import { DonorsSubnav } from "@/components/layout/DonorsSubnav";
import { DonorTable } from "@/components/donors/DonorTable";
import { FlashAlert } from "@/components/ui/FlashAlert";
import * as donorService from "@/lib/services/donor.service";

export default async function DonorsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const params = await searchParams;
  const donors = await donorService.listDonors();

  return (
    <AppShell activeSection="donors">
      <DonorsSubnav active="donors" showAddButton />
      <FlashAlert success={params.success} error={params.error} />
      <DonorTable donors={donors} />
    </AppShell>
  );
}
