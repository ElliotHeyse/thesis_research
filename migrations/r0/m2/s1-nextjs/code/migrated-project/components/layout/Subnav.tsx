import Link from "next/link";
import { ReactNode } from "react";

interface SubnavTab {
  key: string;
  label: string;
  href: string;
}

interface SubnavProps {
  tabs: SubnavTab[];
  activeKey: string;
  actions?: ReactNode;
}

export function Subnav({ tabs, activeKey, actions }: SubnavProps) {
  return (
    <div className="subnav-wrapper">
      <div className="page-header">
        <div className="c-lot-nav-links">
          {tabs.map((tab) => (
            <Link
              key={tab.key}
              href={tab.href}
              className={`c-lot-subnav${tab.key === activeKey ? " c-lot-subnav--active" : ""}`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
        {actions && <div className="actions">{actions}</div>}
      </div>
    </div>
  );
}
