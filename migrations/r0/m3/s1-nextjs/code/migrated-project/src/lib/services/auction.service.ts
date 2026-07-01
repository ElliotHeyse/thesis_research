import * as auctionRepo from "@/lib/repositories/auction.repository";
import type { AuctionItem, CategoryDescription } from "@/lib/types";

export async function getItemsGroupedByCategory(): Promise<
  { category: CategoryDescription; items: AuctionItem[] }[]
> {
  const [items, categories] = await Promise.all([
    auctionRepo.findDisplayItems(),
    auctionRepo.findCategoryDescriptions(),
  ]);

  const byCategory = new Map<number | null, AuctionItem[]>();
  for (const item of items) {
    const key = item.CategoryID;
    if (!byCategory.has(key)) {
      byCategory.set(key, []);
    }
    byCategory.get(key)!.push(item);
  }

  return categories.map((category) => ({
    category,
    items: byCategory.get(category.CategoryID) ?? [],
  }));
}
