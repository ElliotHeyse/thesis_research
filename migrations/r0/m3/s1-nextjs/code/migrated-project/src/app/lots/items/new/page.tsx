import { AppShell } from "@/components/layout/AppShell";
import { LotsSubnav } from "@/components/layout/LotsSubnav";
import { ItemForm } from "@/components/lots/ItemForm";
import { FlashAlert } from "@/components/ui/FlashAlert";
import * as donorService from "@/lib/services/donor.service";
import * as itemService from "@/lib/services/item.service";

export default async function NewItemPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;
  const [donors, { lots }] = await Promise.all([
    donorService.listDonorsForSelect(),
    itemService.listItemsWithLots(),
  ]);

  return (
    <AppShell activeSection="lots">
      <LotsSubnav active="items" />
      <FlashAlert error={sp.error} />
      <h2 style={{ color: "var(--gray-900)", marginBottom: "var(--space-200)" }}>
        Add Item
      </h2>
      <ItemForm donors={donors} lots={lots} />
    </AppShell>
  );
}
