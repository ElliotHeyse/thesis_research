import { AppShell } from "@/components/layout/AppShell";
import { LotsSubnav } from "@/components/layout/LotsSubnav";
import { CategoryForm } from "@/components/lots/CategoryForm";
import { FlashAlert } from "@/components/ui/FlashAlert";

export default async function NewCategoryPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;

  return (
    <AppShell activeSection="lots">
      <LotsSubnav active="categories" />
      <FlashAlert error={sp.error} />
      <h2 style={{ color: "var(--gray-900)", marginBottom: "var(--space-200)" }}>
        Add Category
      </h2>
      <CategoryForm />
    </AppShell>
  );
}
