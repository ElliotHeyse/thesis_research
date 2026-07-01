import { AppShell } from "@/components/layout/AppShell";
import { AuctionCategory } from "@/components/auction/AuctionCategory";
import * as auctionService from "@/lib/services/auction.service";

export default async function AuctionPage() {
  const groups = await auctionService.getItemsGroupedByCategory();

  return (
    <AppShell activeSection="auction">
      <div className="o-flex o-flex--column u-gap-space-200">
        <h2 style={{ color: "var(--gray-900)" }}>Auction Items</h2>
        {groups.map(({ category, items }) => (
          <AuctionCategory
            key={category.CategoryID}
            categoryName={category.Description}
            items={items}
          />
        ))}
      </div>
    </AppShell>
  );
}
