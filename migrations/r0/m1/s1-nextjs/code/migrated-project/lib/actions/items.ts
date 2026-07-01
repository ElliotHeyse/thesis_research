"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  addItem,
  deleteItem,
  getItems,
  modifyItems,
  updateItem,
} from "@/lib/repositories/items";
import type { ItemFormValues } from "@/lib/types";
import { validateItemForm } from "@/lib/validators/item";

function parseItemForm(formData: FormData): ItemFormValues {
  return {
    description: String(formData.get("description") ?? ""),
    retailValue: String(formData.get("retailValue") ?? ""),
    donorID: String(formData.get("donorID") ?? ""),
    lotID: String(formData.get("lotID") ?? "NULL"),
  };
}

export async function saveItemFormAction(
  _prev: { errors?: Record<string, string> },
  formData: FormData,
): Promise<{ errors?: Record<string, string> }> {
  const itemId = formData.get("itemId")
    ? Number(formData.get("itemId"))
    : null;
  const values = parseItemForm(formData);
  const errors = validateItemForm(values);
  if (errors) {
    return { errors };
  }

  const ok = itemId
    ? await updateItem(itemId, values)
    : await addItem(values);

  revalidatePath("/lots/items");
  redirect(
    `/lots/items?${ok ? `success=${itemId ? "updated" : "created"}` : `error=${itemId ? "update_failed" : "create_failed"}`}`,
  );
}

export async function confirmDeleteItemAction(itemId: number) {
  const ok = await deleteItem(itemId);
  revalidatePath("/lots/items");
  redirect(`/lots/items?${ok ? "success=deleted" : "error=delete_failed"}`);
}

export async function saveLotAssignmentsAction(formData: FormData) {
  const items = await getItems();
  const modifiedItems: { itemID: number; newLotID: number }[] = [];

  for (const item of items) {
    const value = formData.get(`lotId_${item.ItemID}`);
    if (value === null) continue;

    const newLotId = Number(value);
    const currentNormalized =
      item.LotID === null || item.LotID === undefined ? -1 : item.LotID;

    if (currentNormalized !== newLotId) {
      modifiedItems.push({ itemID: item.ItemID, newLotID: newLotId });
    }
  }

  if (modifiedItems.length > 0) {
    const ok = await modifyItems(modifiedItems);
    revalidatePath("/lots/items");
    redirect(`/lots/items?${ok ? "success=updated" : "error=update_failed"}`);
  }

  revalidatePath("/lots/items");
  redirect("/lots/items?success=updated");
}
