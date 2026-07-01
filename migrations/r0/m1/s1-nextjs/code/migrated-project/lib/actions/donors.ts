"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { addDonor, deleteDonor, updateDonor } from "@/lib/repositories/donors";
import type { DonorFormValues } from "@/lib/types";
import { validateDonorForm } from "@/lib/validators/donor";

function parseDonorForm(formData: FormData): DonorFormValues {
  return {
    businessName: String(formData.get("businessName") ?? ""),
    contactName: String(formData.get("contactName") ?? ""),
    contactEmail: String(formData.get("contactEmail") ?? ""),
    contactTitle: String(formData.get("contactTitle") ?? ""),
    address: String(formData.get("address") ?? ""),
    city: String(formData.get("city") ?? ""),
    state: String(formData.get("state") ?? ""),
    zipCode: String(formData.get("zipCode") ?? ""),
    taxReceipt: formData.get("taxReceipt") === "on",
  };
}

export async function saveDonorFormAction(
  _prev: { errors?: Record<string, string> },
  formData: FormData,
): Promise<{ errors?: Record<string, string> }> {
  const donorId = formData.get("donorId")
    ? Number(formData.get("donorId"))
    : null;
  const values = parseDonorForm(formData);
  const errors = validateDonorForm(values);
  if (errors) {
    return { errors };
  }

  const ok = donorId
    ? await updateDonor(donorId, values)
    : await addDonor(values);

  revalidatePath("/donors");
  redirect(
    `/donors?${ok ? `success=${donorId ? "updated" : "created"}` : `error=${donorId ? "update_failed" : "create_failed"}`}`,
  );
}

export async function confirmDeleteDonorAction(donorId: number) {
  const ok = await deleteDonor(donorId);
  revalidatePath("/donors");
  redirect(`/donors?${ok ? "success=deleted" : "error=has_items"}`);
}
