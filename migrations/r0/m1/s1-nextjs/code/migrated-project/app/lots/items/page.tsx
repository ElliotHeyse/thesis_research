import { getItems } from "@/lib/repositories/items";
import { getLotDescriptions } from "@/lib/repositories/lots";
import { ItemsTable } from "@/components/lots/LotsTables";
import { ItemsListActions, LotsSubnav } from "@/components/layout/Subnav";
import { FlashMessages } from "@/components/ui/FlashMessages";

export default async function ItemsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const params = await searchParams;
  const [items, lots] = await Promise.all([getItems(), getLotDescriptions()]);

  return (
    <>
      <LotsSubnav activeKey="items" actions={<ItemsListActions />} />
      <FlashMessages success={params.success} error={params.error} />
      <ItemsTable items={items} lots={lots} />
    </>
  );
}
