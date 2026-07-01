import { getDonors } from "@/lib/repositories/donors";
import { DonorSelectTable } from "@/components/donors/DonorTable";
import { DonorsSubnav } from "@/components/layout/Subnav";
import { FlashMessages } from "@/components/ui/FlashMessages";
import { PageIntro } from "@/components/ui/Table";

export default async function DonorLettersPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const params = await searchParams;
  const donors = await getDonors();

  return (
    <>
      <DonorsSubnav activeKey="letters" />
      <FlashMessages success={params.success} error={params.error} />
      <PageIntro>Select donors to generate solicitation letters.</PageIntro>
      <DonorSelectTable
        donors={donors}
        formAction="/api/donors/letters"
        submitLabel="Generate Letters"
      />
    </>
  );
}
