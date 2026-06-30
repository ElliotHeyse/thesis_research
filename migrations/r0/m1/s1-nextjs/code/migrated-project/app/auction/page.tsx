import { getAuctionItems } from "@/lib/repositories/items";
import { getCategoryDescriptions } from "@/lib/repositories/categories";
import { AuctionView } from "@/components/auction/AuctionView";
import type { AuctionItem } from "@/lib/types";

export default async function AuctionPage() {
  const [items, categories] = await Promise.all([
    getAuctionItems(),
    getCategoryDescriptions(),
  ]);

  const itemsByCategory: Record<number, AuctionItem[]> = {};
  for (const item of items) {
    const categoryId = item.CategoryID ?? 0;
    if (!itemsByCategory[categoryId]) {
      itemsByCategory[categoryId] = [];
    }
    itemsByCategory[categoryId].push(item);
  }

  return <AuctionView categories={categories} itemsByCategory={itemsByCategory} />;
}
