import Link from "next/link";

export default function HomePage() {
  return (
    <div className="o-flex o-flex--column u-gap-space-200">
      <h2>Silent Auction Management</h2>
      <p>Select a module to get started.</p>
      <div className="menu-buttons">
        <Link href="/donors">Donors</Link>
        <Link href="/lots/items">Lots</Link>
        <Link href="/auction">Auction</Link>
      </div>
    </div>
  );
}
