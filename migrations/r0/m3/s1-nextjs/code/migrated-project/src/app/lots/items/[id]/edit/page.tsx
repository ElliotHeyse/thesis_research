import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { LotsSubnav } from "@/components/layout/LotsSubnav";
import { ItemForm } from "@/components/lots/ItemForm";
import { FlashAlert } from "@/components/ui/FlashAlert";
import * as donorService from "@/lib/services/donor.service";
import * as itemService from "@/lib/services/item.service";

export default async function EditItemPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const item = await itemService.getItem(Number(id));
  if (!item) notFound();

  const [donors, { lots }] = await Promise.all([
    donorService.listDonorsForSelect(),
    itemService.listItemsWithLots(),
  ]);

  return (
    <AppShell activeSection="lots">
      <LotsSubnav active="items" />
      <FlashAlert error={sp.error} />
      <h2 style={{ color: "var(--gray-900)", marginBottom: "var(--space-200)" }}>
        Edit Item
      </h2>
      <ItemForm item={item} donors={donors} lots={lots} />
    </AppShell>
  );
}
