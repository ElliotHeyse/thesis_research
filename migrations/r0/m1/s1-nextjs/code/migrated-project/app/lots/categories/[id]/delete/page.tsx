import { notFound } from "next/navigation";
import { getCategory } from "@/lib/repositories/categories";
import { confirmDeleteCategoryAction } from "@/lib/actions/categories";
import { LotsSubnav } from "@/components/layout/Subnav";
import { ConfirmDelete } from "@/components/ui/ConfirmDelete";

export default async function DeleteCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const categoryId = Number(id);
  const category = await getCategory(categoryId);

  if (!category) {
    notFound();
  }

  return (
    <>
      <LotsSubnav activeKey="categories" />
      <ConfirmDelete
        entityType="category"
        entity={category as unknown as Record<string, unknown>}
        returnUrl={`/lots/categories/${categoryId}/edit`}
        confirmAction={confirmDeleteCategoryAction.bind(null, categoryId)}
      />
    </>
  );
}
