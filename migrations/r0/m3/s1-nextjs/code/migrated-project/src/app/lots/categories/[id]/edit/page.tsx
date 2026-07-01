import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { LotsSubnav } from "@/components/layout/LotsSubnav";
import { CategoryForm } from "@/components/lots/CategoryForm";
import { FlashAlert } from "@/components/ui/FlashAlert";
import * as categoryService from "@/lib/services/category.service";

export default async function EditCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const category = await categoryService.getCategory(Number(id));
  if (!category) notFound();

  return (
    <AppShell activeSection="lots">
      <LotsSubnav
        active="categories"
        actions={
          <Link href={`/lots/categories/${id}/delete`} className="btn btn-danger">
            Delete Category
          </Link>
        }
      />
      <FlashAlert error={sp.error} />
      <h2 style={{ color: "var(--gray-900)", marginBottom: "var(--space-200)" }}>
        Edit Category
      </h2>
      <CategoryForm category={category} />
    </AppShell>
  );
}
