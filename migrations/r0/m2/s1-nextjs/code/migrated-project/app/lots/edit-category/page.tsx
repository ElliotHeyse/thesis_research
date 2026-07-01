import { redirect } from "next/navigation";
import { LotsSubnav } from "@/components/layout/LotsSubnav";
import { FormActions, FormField } from "@/components/ui/FormField";
import { getCategory } from "@/lib/db/categories";
import { saveCategoryAction } from "../actions";

export default async function EditCategoryPage({
  searchParams,
}: {
  searchParams: Promise<{ CategoryID?: string }>;
}) {
  const params = await searchParams;
  const categoryId = params.CategoryID ? Number(params.CategoryID) : null;

  let description = "";

  if (categoryId) {
    const category = await getCategory(categoryId);
    if (!category) redirect("/lots/categories?error=notfound");
    description = category.Description;
  }

  return (
    <>
      <LotsSubnav
        pathname="/lots/edit-category"
        categoryId={categoryId ?? undefined}
      />
      <form className="c-form" action={saveCategoryAction}>
        {categoryId && (
          <input type="hidden" name="CategoryID" value={categoryId} />
        )}
        <FormField
          label="Description"
          name="Description"
          defaultValue={description}
          maxLength={75}
          required
        />
        <FormActions
          submitLabel={categoryId ? "Update" : "Add Category"}
          cancelHref="/lots/categories"
        />
      </form>
    </>
  );
}
