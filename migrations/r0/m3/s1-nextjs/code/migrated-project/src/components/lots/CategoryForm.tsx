import Link from "next/link";
import { saveCategoryAction } from "@/lib/actions/category.actions";
import type { Category } from "@/lib/types";

export function CategoryForm({ category }: { category?: Category }) {
  return (
    <form className="c-form" action={saveCategoryAction}>
      {category ? (
        <input type="hidden" name="CategoryID" value={category.CategoryID} />
      ) : null}
      <div className="c-form__field">
        <label htmlFor="Description">Description</label>
        <input
          type="text"
          id="Description"
          name="Description"
          required
          maxLength={75}
          defaultValue={category?.Description ?? ""}
        />
      </div>
      <div className="o-flex u-gap-space-200" style={{ marginTop: "var(--space-300)" }}>
        <button type="submit" className="btn btn-success">
          {category ? "Update" : "Add Category"}
        </button>
        <Link href="/lots/categories" className="btn btn-secondary">
          Cancel
        </Link>
      </div>
    </form>
  );
}
