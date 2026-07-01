import Link from "next/link";
import { redirect } from "next/navigation";
import { LotsSubnav } from "@/components/layout/LotsSubnav";
import { formatOrDash } from "@/lib/format";
import { getCategory } from "@/lib/db/categories";
import { deleteCategoryAction } from "../actions";

export default async function DeleteCategoryPage({
  searchParams,
}: {
  searchParams: Promise<{ CategoryID?: string; confirm?: string }>;
}) {
  const params = await searchParams;
  const categoryId = params.CategoryID ? Number(params.CategoryID) : null;

  if (!categoryId) redirect("/lots/categories?error=invalid_id");

  const category = await getCategory(categoryId);
  if (!category) redirect("/lots/categories?error=notfound");

  if (params.confirm === "1") {
    await deleteCategoryAction(categoryId);
  }

  return (
    <>
      <LotsSubnav pathname="/lots/delete-category" categoryId={categoryId} />
      <div className="o-flex o-flex--column u-gap-space-200">
        <h2>Confirm Deletion</h2>
        <p style={{ textAlign: "center", marginBottom: "30px" }}>
          <strong>Are you sure you want to delete this category?</strong>
          <br />
          This action cannot be undone.
        </p>
        <div>
          <p>
            <strong>Category ID:</strong> {category.CategoryID}
          </p>
          <p>
            <strong>Description:</strong>{" "}
            {formatOrDash(category.Description)}
          </p>
        </div>
        <div className="o-flex u-gap-space-100">
          <Link
            href={`/lots/delete-category?CategoryID=${categoryId}&confirm=1`}
            className="btn btn-danger"
          >
            Yes, Delete Permanently
          </Link>
          <Link href="/lots/categories" className="btn btn-secondary">
            No, Cancel
          </Link>
        </div>
      </div>
    </>
  );
}
