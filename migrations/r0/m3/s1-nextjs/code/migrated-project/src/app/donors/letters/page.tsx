import { AppShell } from "@/components/layout/AppShell";
import { DonorsSubnav } from "@/components/layout/DonorsSubnav";
import { DonorSelectTable } from "@/components/donors/DonorTable";
import { FlashAlert } from "@/components/ui/FlashAlert";
import * as donorService from "@/lib/services/donor.service";

export default async function DonorLettersPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const params = await searchParams;
  const donors = await donorService.listDonors();

  return (
    <AppShell activeSection="donors">
      <DonorsSubnav active="letters" />
      <FlashAlert success={params.success} error={params.error} />
      <p className="c-page-intro">Select donors to generate solicitation letters.</p>
      <DonorSelectTable
        donors={donors}
        formAction="/api/donors/letters"
        submitLabel="Generate Letters"
      />
    </AppShell>
  );
}
