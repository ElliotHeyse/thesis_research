import { notFound } from "next/navigation";
import { getDonorsForSelect } from "@/lib/repositories/donors";
import { getItemById } from "@/lib/repositories/items";
import { getLotDescriptions } from "@/lib/repositories/lots";
import { ItemForm } from "@/components/lots/LotForms";
import { LotsSubnav } from "@/components/layout/Subnav";
import { LinkButton } from "@/components/ui/Button";

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const itemId = Number(id);
  const [item, donors, lots] = await Promise.all([
    getItemById(itemId),
    getDonorsForSelect(),
    getLotDescriptions(),
  ]);

  if (!item) {
    notFound();
  }

  return (
    <>
      <LotsSubnav
        activeKey="items"
        actions={
          <LinkButton
            href={`/lots/items/${itemId}/delete`}
            variant="danger"
          >
            Delete Item
          </LinkButton>
        }
      />
      <ItemForm
        itemId={itemId}
        initialValues={{
          description: item.Description ?? "",
          retailValue: String(item.RetailValue ?? ""),
          donorID: String(item.DonorID ?? ""),
          lotID: item.LotID ? String(item.LotID) : "NULL",
        }}
        donors={donors}
        lots={lots}
      />
    </>
  );
}
