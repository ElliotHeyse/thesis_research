import Link from "next/link";
import { ReactNode } from "react";
import { Subnav } from "./Subnav";

const TABS = [
  { key: "items", label: "Items", href: "/lots/items" },
  { key: "lots", label: "Lots", href: "/lots/lots" },
  { key: "categories", label: "Categories", href: "/lots/categories" },
];

interface LotsSubnavProps {
  pathname: string;
  actions?: ReactNode;
  lotId?: number;
  categoryId?: number;
}

export function getLotsActiveKey(pathname: string): string {
  if (pathname.includes("/categories")) return "categories";
  if (
    pathname.includes("/lots/lots") ||
    pathname.includes("/edit-lot") ||
    pathname.includes("/delete-lot") ||
    pathname.includes("/lot-details")
  ) {
    return "lots";
  }
  return "items";
}

export function LotsSubnav({
  pathname,
  actions,
  lotId,
  categoryId,
}: LotsSubnavProps) {
  const activeKey = getLotsActiveKey(pathname);

  let defaultActions: ReactNode = null;

  if (activeKey === "items" && pathname === "/lots/items") {
    defaultActions = (
      <>
        <Link href="/lots/edit-item" className="btn btn-success">
          Add New Item
        </Link>
        <button
          type="submit"
          form="items-lot-form"
          name="save_lot_changes"
          value="1"
          className="btn btn-success"
        >
          Save Changes
        </button>
      </>
    );
  } else if (activeKey === "lots") {
    if (pathname.includes("/edit-lot") && lotId) {
      defaultActions = (
        <Link
          href={`/lots/delete-lot?LotID=${lotId}`}
          className="btn btn-danger"
        >
          Delete Lot
        </Link>
      );
    } else if (
      pathname === "/lots/lots" ||
      (!pathname.includes("/lot-details") &&
        !pathname.includes("/edit-lot") &&
        !pathname.includes("/delete-lot"))
    ) {
      defaultActions = (
        <Link href="/lots/edit-lot" className="btn btn-success">
          Add New Lot
        </Link>
      );
    }
  } else if (activeKey === "categories") {
    if (pathname.includes("/edit-category") && categoryId) {
      defaultActions = (
        <Link
          href={`/lots/delete-category?CategoryID=${categoryId}`}
          className="btn btn-danger"
        >
          Delete Category
        </Link>
      );
    } else if (pathname === "/lots/categories") {
      defaultActions = (
        <Link href="/lots/edit-category" className="btn btn-success">
          Add New Category
        </Link>
      );
    }
  }

  return (
    <Subnav
      tabs={TABS}
      activeKey={activeKey}
      actions={actions ?? defaultActions}
    />
  );
}
