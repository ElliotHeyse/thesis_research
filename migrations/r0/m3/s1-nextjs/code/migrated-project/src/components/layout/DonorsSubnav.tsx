import Link from "next/link";

export function DonorsSubnav({
  active,
  showAddButton,
}: {
  active: "donors" | "pending" | "letters" | "receipts";
  showAddButton?: boolean;
}) {
  const tabs = [
    { key: "donors", label: "All Donors", href: "/donors" },
    { key: "pending", label: "Pending Receipts", href: "/donors/pending-receipts" },
    { key: "letters", label: "Letters", href: "/donors/letters" },
    { key: "receipts", label: "Tax Receipts", href: "/donors/receipts" },
  ] as const;

  return (
    <div className="c-lot-nav-links" style={{ marginBottom: "var(--space-300)" }}>
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          className={`c-lot-subnav${active === tab.key ? " c-lot-subnav--active" : ""}`}
        >
          {tab.label}
        </Link>
      ))}
      {showAddButton ? (
        <Link href="/donors/new" className="btn btn-success" style={{ alignSelf: "center" }}>
          Add New Donor
        </Link>
      ) : null}
    </div>
  );
}
