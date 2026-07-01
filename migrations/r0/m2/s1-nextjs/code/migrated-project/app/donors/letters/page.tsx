import { DonorsSubnav } from "@/components/layout/DonorsSubnav";
import { FlashMessages } from "@/components/layout/FlashMessages";
import { DonorCheckboxTable } from "@/components/ui/DonorsTable";
import { getDonors } from "@/lib/db/donors";

export default async function DonorLettersPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const donors = await getDonors();

  return (
    <>
      <DonorsSubnav pathname="/donors/letters" />
      <FlashMessages error={params.error} />
      <DonorCheckboxTable
        donors={donors}
        formAction="/api/pdf/letters"
        submitLabel="Generate Letters"
      />
    </>
  );
}
