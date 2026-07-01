"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { addLot, deleteLot, updateLot } from "@/lib/repositories/lots";
import type { LotFormValues } from "@/lib/types";
import { validateLotForm } from "@/lib/validators/lot";

function parseLotForm(formData: FormData): LotFormValues {
  return {
    description: String(formData.get("description") ?? ""),
    categoryId: String(formData.get("categoryId") ?? ""),
    highestBid: String(formData.get("highestBid") ?? ""),
    bidderId: String(formData.get("bidderId") ?? ""),
    delivered: formData.get("delivered") === "on",
    image: String(formData.get("image") ?? ""),
  };
}

export async function saveLotFormAction(
  _prev: { errors?: Record<string, string> },
  formData: FormData,
): Promise<{ errors?: Record<string, string> }> {
  const lotId = formData.get("lotId") ? Number(formData.get("lotId")) : null;
  const values = parseLotForm(formData);
  const errors = validateLotForm(values);
  if (errors) {
    return { errors };
  }

  const ok = lotId ? await updateLot(lotId, values) : await addLot(values);

  revalidatePath("/lots/lots");
  if (!ok) {
    return { errors: { description: "Failed to save lot." } };
  }

  redirect("/lots/lots");
}

export async function confirmDeleteLotAction(lotId: number) {
  const ok = await deleteLot(lotId);
  revalidatePath("/lots/lots");
  redirect(`/lots/lots?${ok ? "success=deleted" : "error=delete_failed"}`);
}
