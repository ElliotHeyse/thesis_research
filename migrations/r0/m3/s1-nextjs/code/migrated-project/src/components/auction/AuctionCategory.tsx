import type { AuctionItem } from "@/lib/types";
import { formatCurrency } from "@/lib/utils/format";

export function AuctionCategory({
  categoryName,
  items,
}: {
  categoryName: string;
  items: AuctionItem[];
}) {
  return (
    <section>
      <h3>{categoryName}</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {items.map((item) => (
          <li key={item.ItemID} style={{ marginBottom: "var(--space-200)" }}>
            <h4>{item.Description}</h4>
            <p>Retail Value: {formatCurrency(item.RetailValue)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
