import { LotsSubnav } from "@/components/layout/LotsSubnav";
import { FlashMessages } from "@/components/layout/FlashMessages";
import { CategoriesTable } from "@/components/ui/LotsTable";
import { getCategories } from "@/lib/db/categories";

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const params = await searchParams;
  const categories = await getCategories();

  return (
    <>
      <LotsSubnav pathname="/lots/categories" />
      <FlashMessages success={params.success} error={params.error} />
      <CategoriesTable categories={categories} />
    </>
  );
}
