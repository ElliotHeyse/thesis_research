"use server";

import { redirect } from "next/navigation";
import { ValidationError } from "@/lib/errors";
import * as itemService from "@/lib/services/item.service";

function itemFromForm(formData: FormData) {
  const lotRaw = formData.get("LotID");
  let lotID: number | null = null;
  if (lotRaw && String(lotRaw) !== "" && String(lotRaw) !== "NULL") {
    lotID = Number(lotRaw);
    if (Number(lotRaw) === -1) lotID = null;
  }
  return {
    description: String(formData.get("Description") ?? ""),
    retailValue: Number(formData.get("RetailValue")),
    donorID: Number(formData.get("DonorID")),
    lotID,
  };
}

export async function saveItemAction(formData: FormData) {
  const itemId = formData.get("ItemID");
  const isEdit = itemId && String(itemId) !== "";
  try {
    const data = itemFromForm(formData);
    if (isEdit) {
      await itemService.updateItem(Number(itemId), data);
      redirect("/lots/items?success=updated");
    } else {
      await itemService.createItem(data);
      redirect("/lots/items?success=created");
    }
  } catch (error) {
    if (error instanceof ValidationError) {
      redirect(`/lots/items/${isEdit ? `${itemId}/edit` : "new"}?error=validation`);
    }
    redirect(`/lots/items?error=${isEdit ? "update_failed" : "create_failed"}`);
  }
}

export async function deleteItemAction(itemId: number) {
  try {
    await itemService.deleteItem(itemId);
    redirect("/lots/items?success=deleted");
  } catch {
    redirect("/lots/items?error=delete_failed");
  }
}

export async function bulkAssignLotsAction(formData: FormData) {
  const assignments: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    const match = key.match(/^LotID\[(\d+)\]$/);
    if (match) {
      assignments[match[1]] = String(value);
    }
  }
  try {
    await itemService.bulkAssignLots(assignments);
    redirect("/lots/items?success=updated");
  } catch {
    redirect("/lots/items?error=update_failed");
  }
}
