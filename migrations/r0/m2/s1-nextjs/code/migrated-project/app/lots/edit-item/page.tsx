import { redirect } from "next/navigation";
import { LotsSubnav } from "@/components/layout/LotsSubnav";
import {
  FormActions,
  FormField,
  SelectField,
} from "@/components/ui/FormField";
import { getDonorsForSelect } from "@/lib/db/donors";
import { donorDisplayName } from "@/lib/format";
import { getItemById, getLotDescriptions } from "@/lib/db/items";
import { saveItemAction } from "../actions";

export default async function EditItemPage({
  searchParams,
}: {
  searchParams: Promise<{ ItemID?: string }>;
}) {
  const params = await searchParams;
  const itemId = params.ItemID ? Number(params.ItemID) : null;

  const [donors, lots] = await Promise.all([
    getDonorsForSelect(),
    getLotDescriptions(),
  ]);

  let defaults = {
    description: "",
    retailValue: "",
    donorID: "",
    lotID: "",
  };

  if (itemId) {
    const item = await getItemById(itemId);
    if (!item) redirect("/lots/items?error=notfound");
    defaults = {
      description: item.Description,
      retailValue: String(item.RetailValue),
      donorID: String(item.DonorID),
      lotID: item.LotID ? String(item.LotID) : "",
    };
  }

  const donorOptions = donors.map((donor) => {
    let label = donorDisplayName(donor);
    if (donor.ContactName && label !== donor.ContactName) {
      label += ` (${donor.ContactName})`;
    } else if (donor.ContactName) {
      label = donor.ContactName;
    }
    return { value: donor.DonorID, label };
  });

  return (
    <>
      <LotsSubnav pathname="/lots/edit-item" />
      <form className="c-form" action={saveItemAction}>
        {itemId && <input type="hidden" name="ItemID" value={itemId} />}
        <FormField
          label="Description"
          name="Description"
          defaultValue={defaults.description}
          maxLength={75}
          required
        />
        <FormField
          label="Retail Value"
          name="RetailValue"
          type="number"
          defaultValue={defaults.retailValue}
          step="0.01"
          required
        />
        <SelectField
          label="Donor"
          name="DonorID"
          options={donorOptions}
          defaultValue={defaults.donorID}
          required
        />
        <SelectField
          label="Lot (optional)"
          name="LotID"
          options={lots.map((l) => ({
            value: l.LotID,
            label: l.Description,
          }))}
          defaultValue={defaults.lotID}
          allowEmpty
          emptyLabel="— Unassigned —"
        />
        <FormActions
          submitLabel={itemId ? "Update Item" : "Add Item"}
          cancelHref="/lots/items"
        />
      </form>
    </>
  );
}
