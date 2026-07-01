import { formatCurrency } from "@/lib/format";
import type { AuctionItem } from "@/lib/types";

export function AuctionView({
  categories,
  itemsByCategory,
}: {
  categories: { CategoryID: number; Description: string }[];
  itemsByCategory: Record<number, AuctionItem[]>;
}) {
  return (
    <div className="o-flex o-flex--column u-gap-space-200">
      {categories.map((category) => {
        const items = itemsByCategory[category.CategoryID] ?? [];
        return (
          <section key={category.CategoryID}>
            <h3>{category.Description}</h3>
            {items.length === 0 ? (
              <p>No items in this category.</p>
            ) : (
              <ul>
                {items.map((item) => (
                  <li key={item.ItemID}>
                    <div>
                      <h4>{item.Description}</h4>
                      <p>Retail Value: {formatCurrency(item.RetailValue)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
