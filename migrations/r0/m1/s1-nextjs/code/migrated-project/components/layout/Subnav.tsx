import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";

interface SubnavTab {
  label: string;
  href: string;
  key: string;
}

export function Subnav({
  tabs,
  activeKey,
  actions,
}: {
  tabs: SubnavTab[];
  activeKey: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="c-subnav">
      <div className="c-lot-nav-links c-subnav__tabs">
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            href={tab.href}
            className={`c-lot-subnav${activeKey === tab.key ? " c-lot-subnav--active" : ""}`}
          >
            {tab.label}
          </Link>
        ))}
      </div>
      {actions && <div className="c-subnav__actions">{actions}</div>}
    </div>
  );
}

export function DonorsSubnav({
  activeKey,
  actions,
}: {
  activeKey: string;
  actions?: React.ReactNode;
}) {
  const tabs = [
    { key: "donors", label: "All Donors", href: "/donors" },
    { key: "pending", label: "Pending Receipts", href: "/donors/pending-receipts" },
    { key: "letters", label: "Letters", href: "/donors/letters" },
    { key: "receipts", label: "Tax Receipts", href: "/donors/receipts" },
  ];
  return <Subnav tabs={tabs} activeKey={activeKey} actions={actions} />;
}

export function LotsSubnav({
  activeKey,
  actions,
}: {
  activeKey: string;
  actions?: React.ReactNode;
}) {
  const tabs = [
    { key: "items", label: "Items", href: "/lots/items" },
    { key: "lots", label: "Lots", href: "/lots/lots" },
    { key: "categories", label: "Categories", href: "/lots/categories" },
  ];
  return <Subnav tabs={tabs} activeKey={activeKey} actions={actions} />;
}

export function DonorsListActions() {
  return <LinkButton href="/donors/new">Add New Donor</LinkButton>;
}

export function ItemsListActions() {
  return (
    <>
      <LinkButton href="/lots/items/new">Add New Item</LinkButton>
      <button type="submit" form="items-lot-form" className="btn btn-success">
        Save Changes
      </button>
    </>
  );
}

export function LotsListActions() {
  return <LinkButton href="/lots/lots/new">Add New Lot</LinkButton>;
}

export function CategoriesListActions() {
  return <LinkButton href="/lots/categories/new">Add New Category</LinkButton>;
}
