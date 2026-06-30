import { getLots } from "@/lib/repositories/lots";
import { LotsTable } from "@/components/lots/LotsTables";
import { LotsListActions, LotsSubnav } from "@/components/layout/Subnav";
import { FlashMessages } from "@/components/ui/FlashMessages";

export default async function LotsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const params = await searchParams;
  const lots = await getLots();

  return (
    <>
      <LotsSubnav activeKey="lots" actions={<LotsListActions />} />
      <FlashMessages success={params.success} error={params.error} />
      <LotsTable lots={lots} />
    </>
  );
}
