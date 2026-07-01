import { LotsSubnav } from "@/components/layout/LotsSubnav";
import { FlashMessages } from "@/components/layout/FlashMessages";
import { LotsTable } from "@/components/ui/LotsTable";
import { getLots } from "@/lib/db/items";

export default async function LotsListPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const params = await searchParams;
  const lots = await getLots();

  return (
    <>
      <LotsSubnav pathname="/lots/lots" />
      <FlashMessages success={params.success} error={params.error} />
      <LotsTable lots={lots} />
    </>
  );
}
