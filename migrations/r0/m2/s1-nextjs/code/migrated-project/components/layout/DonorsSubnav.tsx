import Link from "next/link";
import { ReactNode } from "react";
import { Subnav } from "./Subnav";

const TABS = [
  { key: "donors", label: "All Donors", href: "/donors" },
  {
    key: "pending",
    label: "Pending Receipts",
    href: "/donors/pending-receipts",
  },
  { key: "letters", label: "Letters", href: "/donors/letters" },
  { key: "receipts", label: "Tax Receipts", href: "/donors/receipts" },
];

interface DonorsSubnavProps {
  pathname: string;
  actions?: ReactNode;
}

export function getDonorsActiveKey(pathname: string): string {
  if (pathname.includes("/pending-receipts")) return "pending";
  if (pathname.includes("/letters")) return "letters";
  if (pathname.includes("/receipts")) return "receipts";
  return "donors";
}

export function DonorsSubnav({ pathname, actions }: DonorsSubnavProps) {
  const activeKey = getDonorsActiveKey(pathname);
  const defaultActions =
    activeKey === "donors" && pathname === "/donors" ? (
      <Link href="/donors/edit" className="btn btn-success">
        Add New Donor
      </Link>
    ) : null;

  return (
    <Subnav
      tabs={TABS}
      activeKey={activeKey}
      actions={actions ?? defaultActions}
    />
  );
}
