import { redirect } from "next/navigation";
import { LotsSubnav } from "@/components/layout/LotsSubnav";
import {
  FormActions,
  FormField,
  SelectField,
} from "@/components/ui/FormField";
import { getCategories } from "@/lib/db/categories";
import { getBidders, getLot } from "@/lib/db/items";
import { saveLotAction } from "../actions";

export default async function EditLotPage({
  searchParams,
}: {
  searchParams: Promise<{ LotID?: string }>;
}) {
  const params = await searchParams;
  const lotId = params.LotID ? Number(params.LotID) : null;

  const [categories, bidders] = await Promise.all([
    getCategories(),
    getBidders(),
  ]);

  let defaults = {
    description: "",
    categoryId: "",
    highestBid: "",
    bidderId: "",
    delivered: false,
    image: "",
  };

  if (lotId) {
    const lot = await getLot(lotId);
    if (!lot) redirect("/lots/lots?error=notfound");
    defaults = {
      description: lot.Description,
      categoryId: lot.CategoryID ? String(lot.CategoryID) : "",
      highestBid: lot.WinningBid != null ? String(lot.WinningBid) : "",
      bidderId: lot.WinningBidder ? String(lot.WinningBidder) : "",
      delivered: Boolean(lot.Delivered),
      image: lot.Image ?? "",
    };
  }

  return (
    <>
      <LotsSubnav pathname="/lots/edit-lot" lotId={lotId ?? undefined} />
      <form className="c-form" action={saveLotAction}>
        {lotId && <input type="hidden" name="LotID" value={lotId} />}
        <FormField
          label="Description"
          name="Description"
          defaultValue={defaults.description}
          maxLength={75}
          required
        />
        <SelectField
          label="Category"
          name="CategoryID"
          options={categories.map((c) => ({
            value: c.CategoryID,
            label: c.Description,
          }))}
          defaultValue={defaults.categoryId}
          allowEmpty
        />
        <FormField
          label="Highest Bid"
          name="HighestBid"
          type="number"
          defaultValue={defaults.highestBid}
          step="0.01"
        />
        <SelectField
          label="Bidder"
          name="BidderID"
          options={bidders.map((b) => ({
            value: b.BidderID,
            label: b.Name,
          }))}
          defaultValue={defaults.bidderId}
          allowEmpty
        />
        <FormField
          label="Delivered"
          name="Delivered"
          type="checkbox"
          checked={defaults.delivered}
        />
        <FormField
          label="Image URL"
          name="Image"
          type="url"
          defaultValue={defaults.image}
        />
        <FormActions
          submitLabel={lotId ? "Update" : "Add Lot"}
          cancelHref="/lots/lots"
        />
      </form>
    </>
  );
}
