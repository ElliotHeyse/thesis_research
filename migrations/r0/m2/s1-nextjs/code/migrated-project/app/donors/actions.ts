"use server";

import { redirect } from "next/navigation";
import {
  addDonor,
  deleteDonor,
  updateDonor,
} from "@/lib/db/donors";
import { donorSchema, fieldErrors } from "@/lib/validation/schemas";

function parseDonorForm(formData: FormData) {
  return {
    businessName: String(formData.get("BusinessName") ?? ""),
    contactName: String(formData.get("ContactName") ?? ""),
    contactEmail: String(formData.get("ContactEmail") ?? ""),
    contactTitle: String(formData.get("ContactTitle") ?? ""),
    address: String(formData.get("Address") ?? ""),
    city: String(formData.get("City") ?? ""),
    state: String(formData.get("State") ?? ""),
    zipCode: String(formData.get("ZipCode") ?? ""),
    taxReceipt: formData.get("TaxReceipt") === "on",
  };
}

export async function saveDonorAction(formData: FormData) {
  const donorIdRaw = formData.get("DonorID");
  const donorId = donorIdRaw ? Number(donorIdRaw) : null;
  const raw = parseDonorForm(formData);
  const parsed = donorSchema.safeParse(raw);

  if (!parsed.success) {
    const params = new URLSearchParams();
    if (donorId) params.set("DonorID", String(donorId));
    params.set("error", "validation");
    redirect(`/donors/edit?${params.toString()}`);
  }

  const values = parsed.data;
  if (donorId) {
    const ok = await updateDonor(donorId, values);
    redirect(
      ok ? "/donors?success=updated" : "/donors?error=update_failed"
    );
  }

  const ok = await addDonor(values);
  redirect(ok ? "/donors?success=created" : "/donors?error=create_failed");
}

export async function deleteDonorAction(donorId: number) {
  const ok = await deleteDonor(donorId);
  redirect(ok ? "/donors?success=deleted" : "/donors?error=has_items");
}

export type DonorFormState = {
  errors?: Record<string, string>;
  values?: ReturnType<typeof parseDonorForm>;
};

export async function validateDonorForm(
  formData: FormData
): Promise<DonorFormState | null> {
  const raw = parseDonorForm(formData);
  const parsed = donorSchema.safeParse(raw);
  if (parsed.success) return null;
  return { errors: fieldErrors(parsed.error), values: raw };
}
