import { getCategories } from "@/lib/repositories/categories";
import { CategoriesTable } from "@/components/lots/LotsTables";
import { CategoriesListActions, LotsSubnav } from "@/components/layout/Subnav";
import { FlashMessages } from "@/components/ui/FlashMessages";

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const params = await searchParams;
  const categories = await getCategories();

  return (
    <>
      <LotsSubnav activeKey="categories" actions={<CategoriesListActions />} />
      <FlashMessages success={params.success} error={params.error} />
      <CategoriesTable categories={categories} />
    </>
  );
}
