import Link from "next/link";

type LotsTab = "items" | "lots" | "categories";

export function LotsSubnav({
  active,
  actions,
}: {
  active: LotsTab;
  actions?: React.ReactNode;
}) {
  const tabs = [
    { key: "items", label: "Items", href: "/lots/items" },
    { key: "lots", label: "Lots", href: "/lots" },
    { key: "categories", label: "Categories", href: "/lots/categories" },
  ] as const;

  return (
    <div
      className="o-flex o-flex--justify-between o-flex--align-center"
      style={{ marginBottom: "var(--space-300)", flexWrap: "wrap", gap: "var(--space-200)" }}
    >
      <div className="c-lot-nav-links">
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            href={tab.href}
            className={`c-lot-subnav${active === tab.key ? " c-lot-subnav--active" : ""}`}
          >
            {tab.label}
          </Link>
        ))}
      </div>
      {actions ? <div className="actions">{actions}</div> : null}
    </div>
  );
}
