import { LotsSubnav } from "@/components/layout/LotsSubnav";
import { FlashMessages } from "@/components/layout/FlashMessages";
import { ItemsTable } from "@/components/ui/LotsTable";
import { getItems, getLotDescriptions } from "@/lib/db/items";
import { saveLotAssignmentsAction } from "../actions";

export default async function ItemsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const params = await searchParams;
  const [items, lotDescriptions] = await Promise.all([
    getItems(),
    getLotDescriptions(),
  ]);

  return (
    <>
      <LotsSubnav pathname="/lots/items" />
      <FlashMessages success={params.success} error={params.error} />
      <form id="items-lot-form" action={saveLotAssignmentsAction}>
        <ItemsTable items={items} lotDescriptions={lotDescriptions} />
      </form>
    </>
  );
}
