"use client";

import { useActionState } from "react";
import { saveItemFormAction } from "@/lib/actions/items";
import { saveLotFormAction } from "@/lib/actions/lots";
import { saveCategoryFormAction } from "@/lib/actions/categories";
import type { Category, Donor, ItemFormValues, Lot } from "@/lib/types";
import { donorDisplayName } from "@/lib/format";
import { LinkButton } from "@/components/ui/Button";

function FormField({
  label,
  name,
  type = "text",
  defaultValue = "",
  error,
  maxLength,
  required,
  step,
  children,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  error?: string;
  maxLength?: number;
  required?: boolean;
  step?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="c-form__field">
      <label htmlFor={name}>{label}</label>
      {children ?? (
        <input
          type={type}
          id={name}
          name={name}
          defaultValue={defaultValue}
          maxLength={maxLength}
          required={required}
          step={step}
        />
      )}
      {error && <span className="c-form__error">{error}</span>}
    </div>
  );
}

export function ItemForm({
  itemId,
  initialValues,
  donors,
  lots,
}: {
  itemId?: number;
  initialValues: ItemFormValues;
  donors: Pick<Donor, "DonorID" | "BusinessName" | "ContactName">[];
  lots: Pick<Lot, "LotID" | "Description">[];
}) {
  const [state, formAction, pending] = useActionState(saveItemFormAction, {});
  const errors = state.errors ?? {};

  const donorOptions = donors.map((donor) => {
    let label = donorDisplayName(donor);
    if (donor.ContactName && label !== donor.ContactName) {
      label += ` (${donor.ContactName})`;
    } else if (donor.ContactName) {
      label = donor.ContactName;
    }
    return { id: donor.DonorID, label };
  });

  return (
    <form className="c-form" action={formAction}>
      {itemId && <input type="hidden" name="itemId" value={itemId} />}
      <FormField
        label="Description"
        name="description"
        defaultValue={initialValues.description}
        error={errors.description}
        maxLength={75}
        required
      />
      <FormField
        label="Retail Value"
        name="retailValue"
        type="number"
        defaultValue={initialValues.retailValue}
        error={errors.retailValue}
        step="0.01"
        required
      />
      <FormField label="Donor" name="donorID" error={errors.donorID}>
        <select
          id="donorID"
          name="donorID"
          defaultValue={initialValues.donorID}
          required
        >
          <option value="">Select donor</option>
          {donorOptions.map((d) => (
            <option key={d.id} value={d.id}>
              {d.label}
            </option>
          ))}
        </select>
      </FormField>
      <FormField label="Lot (optional)" name="lotID" error={errors.lotID}>
        <select id="lotID" name="lotID" defaultValue={initialValues.lotID}>
          <option value="NULL">--- No lot selected ---</option>
          {lots.map((lot) => (
            <option key={lot.LotID} value={lot.LotID}>
              {lot.Description}
            </option>
          ))}
        </select>
      </FormField>
      <div className="o-flex u-gap-space-100">
        <button type="submit" className="btn btn-success" disabled={pending}>
          {itemId ? "Update Item" : "Add Item"}
        </button>
        <LinkButton href="/lots/items" variant="secondary">
          Cancel
        </LinkButton>
      </div>
    </form>
  );
}

export function LotForm({
  lotId,
  initialValues,
  categories,
  bidders,
}: {
  lotId?: number;
  initialValues: {
    description: string;
    categoryId: string;
    highestBid: string;
    bidderId: string;
    delivered: boolean;
    image: string;
  };
  categories: Category[];
  bidders: { BidderID: number; Name: string }[];
}) {
  const [state, formAction, pending] = useActionState(saveLotFormAction, {});
  const errors = state.errors ?? {};

  return (
    <form className="c-form" action={formAction}>
      {lotId && <input type="hidden" name="lotId" value={lotId} />}
      <FormField
        label="Description"
        name="description"
        defaultValue={initialValues.description}
        error={errors.description}
        required
      />
      <FormField label="Category" name="categoryId">
        <select
          id="categoryId"
          name="categoryId"
          defaultValue={initialValues.categoryId}
        >
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c.CategoryID} value={c.CategoryID}>
              {c.Description}
            </option>
          ))}
        </select>
      </FormField>
      <FormField
        label="Highest Bid"
        name="highestBid"
        type="number"
        defaultValue={initialValues.highestBid}
        error={errors.highestBid}
        step="0.01"
      />
      <FormField label="Bidder" name="bidderId">
        <select
          id="bidderId"
          name="bidderId"
          defaultValue={initialValues.bidderId}
        >
          <option value="">Select bidder</option>
          {bidders.map((b) => (
            <option key={b.BidderID} value={b.BidderID}>
              {b.Name}
            </option>
          ))}
        </select>
      </FormField>
      <div className="c-form__field">
        <label htmlFor="delivered">Delivered</label>
        <input
          type="checkbox"
          id="delivered"
          name="delivered"
          defaultChecked={initialValues.delivered}
        />
      </div>
      <FormField
        label="Image URL"
        name="image"
        defaultValue={initialValues.image}
        error={errors.image}
      />
      <div className="o-flex u-gap-space-100">
        <button type="submit" className="btn btn-success" disabled={pending}>
          {lotId ? "Update" : "Add Lot"}
        </button>
        <LinkButton href="/lots/lots" variant="secondary">
          Cancel
        </LinkButton>
      </div>
    </form>
  );
}

export function CategoryForm({
  categoryId,
  initialDescription,
}: {
  categoryId?: number;
  initialDescription: string;
}) {
  const [state, formAction, pending] = useActionState(
    saveCategoryFormAction,
    {},
  );
  const errors = state.errors ?? {};

  return (
    <form className="c-form" action={formAction}>
      {categoryId && (
        <input type="hidden" name="categoryId" value={categoryId} />
      )}
      <FormField
        label="Description"
        name="description"
        defaultValue={initialDescription}
        error={errors.description}
        required
      />
      <div className="o-flex u-gap-space-100">
        <button type="submit" className="btn btn-success" disabled={pending}>
          {categoryId ? "Update" : "Add Category"}
        </button>
        <LinkButton href="/lots/categories" variant="secondary">
          Cancel
        </LinkButton>
      </div>
    </form>
  );
}
