import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { LotsSubnav } from "@/components/layout/LotsSubnav";
import { ConfirmDelete } from "@/components/ui/ConfirmDelete";
import { deleteCategoryAction } from "@/lib/actions/category.actions";
import * as categoryService from "@/lib/services/category.service";

export default async function DeleteCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const categoryId = Number(id);
  const category = await categoryService.getCategory(categoryId);
  if (!category) notFound();

  return (
    <AppShell activeSection="lots">
      <LotsSubnav active="categories" />
      <ConfirmDelete
        entityType="category"
        entity={category as unknown as Record<string, unknown>}
        cancelHref="/lots/categories"
        deleteAction={deleteCategoryAction.bind(null, categoryId)}
      />
    </AppShell>
  );
}
