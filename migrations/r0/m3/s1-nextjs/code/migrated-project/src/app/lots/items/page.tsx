import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { LotsSubnav } from "@/components/layout/LotsSubnav";
import { ItemsTable } from "@/components/lots/Tables";
import { FlashAlert } from "@/components/ui/FlashAlert";
import * as itemService from "@/lib/services/item.service";

export default async function ItemsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const params = await searchParams;
  const { items, lots } = await itemService.listItemsWithLots();

  return (
    <AppShell activeSection="lots">
      <LotsSubnav
        active="items"
        actions={
          <>
            <Link href="/lots/items/new" className="btn btn-success">
              Add New Item
            </Link>
            <button
              type="submit"
              form="items-lot-form"
              className="btn btn-success"
            >
              Save Changes
            </button>
          </>
        }
      />
      <FlashAlert success={params.success} error={params.error} />
      <ItemsTable items={items} lots={lots} />
    </AppShell>
  );
}
