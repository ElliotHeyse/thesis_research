import { notFound } from "next/navigation";
import { getCategory } from "@/lib/repositories/categories";
import { CategoryForm } from "@/components/lots/LotForms";
import { LotsSubnav } from "@/components/layout/Subnav";
import { LinkButton } from "@/components/ui/Button";

export default async function EditCategoryPage({
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
      <LotsSubnav
        activeKey="categories"
        actions={
          <LinkButton
            href={`/lots/categories/${categoryId}/delete`}
            variant="danger"
          >
            Delete Category
          </LinkButton>
        }
      />
      <CategoryForm
        categoryId={categoryId}
        initialDescription={category.Description}
      />
    </>
  );
}
