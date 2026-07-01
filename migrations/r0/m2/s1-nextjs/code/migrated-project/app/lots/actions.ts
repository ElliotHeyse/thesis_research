"use server";

import { redirect } from "next/navigation";
import {
  addCategory,
  deleteCategory,
  updateCategory,
} from "@/lib/db/categories";
import {
  addItem,
  addLot,
  deleteItem,
  deleteLot,
  getItems,
  modifyItems,
  updateItem,
  updateLot,
} from "@/lib/db/items";
import {
  categorySchema,
  itemSchema,
  lotSchema,
} from "@/lib/validation/schemas";

export async function saveLotAssignmentsAction(formData: FormData) {
  const items = await getItems();
  const itemsById = new Map(items.map((item) => [item.ItemID, item]));

  const modifiedItems: { itemID: number; newLotID: number }[] = [];

  for (const [key, value] of formData.entries()) {
    const match = key.match(/^LotID\[(\d+)\]$/);
    if (!match) continue;

    const itemId = Number(match[1]);
    const newLotId = Number(value);
    if (!itemsById.has(itemId) || Number.isNaN(newLotId)) continue;

    const current = itemsById.get(itemId)!;
    const currentNormalized =
      current.LotID === null || current.LotID === undefined
        ? -1
        : Number(current.LotID);

    if (currentNormalized !== newLotId) {
      modifiedItems.push({ itemID: itemId, newLotID: newLotId });
    }
  }

  if (modifiedItems.length > 0) {
    const ok = await modifyItems(modifiedItems);
    redirect(ok ? "/lots/items?success=updated" : "/lots/items?error=update_failed");
  }

  redirect("/lots/items?success=updated");
}

export async function saveItemAction(formData: FormData) {
  const itemIdRaw = formData.get("ItemID");
  const itemId = itemIdRaw ? Number(itemIdRaw) : null;

  const lotIdRaw = formData.get("LotID");
  const lotID =
    !lotIdRaw || lotIdRaw === "" || lotIdRaw === "NULL"
      ? null
      : Number(lotIdRaw);

  const parsed = itemSchema.safeParse({
    description: formData.get("Description"),
    retailValue: formData.get("RetailValue"),
    donorID: formData.get("DonorID"),
    lotID: lotID ?? -1,
  });

  if (!parsed.success) {
    redirect(
      itemId
        ? `/lots/edit-item?ItemID=${itemId}&error=validation`
        : "/lots/edit-item?error=validation"
    );
  }

  const values = {
    description: parsed.data.description,
    retailValue: parsed.data.retailValue,
    donorID: parsed.data.donorID,
    lotID: parsed.data.lotID,
  };

  if (itemId) {
    const ok = await updateItem(itemId, values);
    redirect(
      ok ? "/lots/items?success=updated" : "/lots/items?error=update_failed"
    );
  }

  const ok = await addItem(values);
  redirect(ok ? "/lots/items?success=created" : "/lots/items?error=create_failed");
}

export async function deleteItemAction(itemId: number) {
  const ok = await deleteItem(itemId);
  redirect(
    ok ? "/lots/items?success=deleted" : "/lots/items?error=delete_failed"
  );
}

export async function saveLotAction(formData: FormData) {
  const lotIdRaw = formData.get("LotID");
  const lotId = lotIdRaw ? Number(lotIdRaw) : null;

  const parsed = lotSchema.safeParse({
    description: formData.get("Description"),
    categoryId: formData.get("CategoryID") || null,
    highestBid: formData.get("HighestBid") || null,
    bidderId: formData.get("BidderID") || null,
    delivered: formData.get("Delivered") === "on",
    image: formData.get("Image") || null,
  });

  if (!parsed.success) {
    redirect(
      lotId
        ? `/lots/edit-lot?LotID=${lotId}&error=validation`
        : "/lots/edit-lot?error=validation"
    );
  }

  const values = {
    description: parsed.data.description,
    categoryId: parsed.data.categoryId ?? null,
    highestBid: parsed.data.highestBid ?? null,
    bidderId: parsed.data.bidderId ?? null,
    delivered: parsed.data.delivered ?? false,
    image: parsed.data.image ?? null,
  };

  if (lotId) {
    await updateLot(lotId, values);
  } else {
    await addLot(values);
  }

  redirect("/lots/lots");
}

export async function deleteLotAction(lotId: number) {
  const ok = await deleteLot(lotId);
  redirect(
    ok ? "/lots/lots?success=deleted" : "/lots/lots?error=delete_failed"
  );
}

export async function saveCategoryAction(formData: FormData) {
  const categoryIdRaw = formData.get("CategoryID");
  const categoryId = categoryIdRaw ? Number(categoryIdRaw) : null;

  const parsed = categorySchema.safeParse({
    description: formData.get("Description"),
  });

  if (!parsed.success) {
    redirect(
      categoryId
        ? `/lots/edit-category?CategoryID=${categoryId}&error=validation`
        : "/lots/edit-category?error=validation"
    );
  }

  if (categoryId) {
    await updateCategory(categoryId, parsed.data);
  } else {
    await addCategory(parsed.data);
  }

  redirect("/lots/categories");
}

export async function deleteCategoryAction(categoryId: number) {
  const ok = await deleteCategory(categoryId);
  redirect(
    ok
      ? "/lots/categories?success=deleted"
      : "/lots/categories?error=delete_failed"
  );
}
