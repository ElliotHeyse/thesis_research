import { AuctionCategory } from "@/components/ui/AuctionCategory";
import {
  getAuctionItems,
  getCategoryDescriptions,
} from "@/lib/db/auction";
import type { AuctionItem } from "@/lib/db/types";

export default async function AuctionPage() {
  const [items, categoryDescriptions] = await Promise.all([
    getAuctionItems(),
    getCategoryDescriptions(),
  ]);

  const itemsByCategory = new Map<number | null, AuctionItem[]>();
  for (const item of items) {
    const key = item.CategoryID;
    if (!itemsByCategory.has(key)) {
      itemsByCategory.set(key, []);
    }
    itemsByCategory.get(key)!.push(item);
  }

  return (
    <div className="o-flex o-flex--column u-gap-space-200">
      {categoryDescriptions.map((category) => (
        <AuctionCategory
          key={category.CategoryID}
          categoryName={category.Description}
          items={itemsByCategory.get(category.CategoryID) ?? []}
        />
      ))}
      {(itemsByCategory.get(null) ?? []).length > 0 && (
        <AuctionCategory
          categoryName="Uncategorized"
          items={itemsByCategory.get(null) ?? []}
        />
      )}
    </div>
  );
}
