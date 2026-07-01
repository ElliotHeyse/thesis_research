import { notFound } from "next/navigation";
import { getItemById } from "@/lib/repositories/items";
import { confirmDeleteItemAction } from "@/lib/actions/items";
import { LotsSubnav } from "@/components/layout/Subnav";
import { ConfirmDelete } from "@/components/ui/ConfirmDelete";

export default async function DeleteItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const itemId = Number(id);
  const item = await getItemById(itemId);

  if (!item) {
    notFound();
  }

  return (
    <>
      <LotsSubnav activeKey="items" />
      <ConfirmDelete
        entityType="item"
        entity={item as unknown as Record<string, unknown>}
        returnUrl="/lots/items"
        confirmAction={confirmDeleteItemAction.bind(null, itemId)}
      />
    </>
  );
}
