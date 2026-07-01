import { formatCurrency } from "@/lib/format";
import type { AuctionItem } from "@/lib/db/types";

export function AuctionCategory({
  categoryName,
  items,
}: {
  categoryName: string;
  items: AuctionItem[];
}) {
  if (items.length === 0) return null;

  return (
    <section>
      <h2>{categoryName}</h2>
      <ul>
        {items.map((item) => (
          <li key={item.ItemID}>
            <strong>{item.Description}</strong> —{" "}
            {formatCurrency(item.RetailValue)}
          </li>
        ))}
      </ul>
    </section>
  );
}
