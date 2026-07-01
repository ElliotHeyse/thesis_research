import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";

export default function HomePage() {
  return (
    <AppShell activeSection="home">
      <div className="o-flex o-flex--column u-gap-space-200">
        <h2 style={{ color: "var(--gray-900)" }}>Silent Auction Management</h2>
        <p>Select a module to get started.</p>
        <div className="menu-buttons">
          <Link href="/donors">Donors</Link>
          <Link href="/lots/items">Lots</Link>
          <Link href="/auction">Auction</Link>
        </div>
      </div>
    </AppShell>
  );
}
