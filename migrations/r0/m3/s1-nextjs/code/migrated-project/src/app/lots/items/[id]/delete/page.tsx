import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { LotsSubnav } from "@/components/layout/LotsSubnav";
import { ConfirmDelete } from "@/components/ui/ConfirmDelete";
import { deleteItemAction } from "@/lib/actions/item.actions";
import * as itemService from "@/lib/services/item.service";

export default async function DeleteItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const itemId = Number(id);
  const item = await itemService.getItem(itemId);
  if (!item) notFound();

  return (
    <AppShell activeSection="lots">
      <LotsSubnav active="items" />
      <ConfirmDelete
        entityType="item"
        entity={item as unknown as Record<string, unknown>}
        cancelHref="/lots/items"
        deleteAction={deleteItemAction.bind(null, itemId)}
      />
    </AppShell>
  );
}
