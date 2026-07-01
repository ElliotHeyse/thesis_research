import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { LotsSubnav } from "@/components/layout/LotsSubnav";
import { CategoriesTable } from "@/components/lots/Tables";
import { FlashAlert } from "@/components/ui/FlashAlert";
import * as categoryService from "@/lib/services/category.service";

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const params = await searchParams;
  const categories = await categoryService.listCategories();

  return (
    <AppShell activeSection="lots">
      <LotsSubnav
        active="categories"
        actions={
          <Link href="/lots/categories/new" className="btn btn-success">
            Add New Category
          </Link>
        }
      />
      <FlashAlert success={params.success} error={params.error} />
      <CategoriesTable categories={categories} />
    </AppShell>
  );
}
