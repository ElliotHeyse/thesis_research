"use server";

import { redirect } from "next/navigation";
import { BusinessRuleError, ValidationError } from "@/lib/errors";
import * as donorService from "@/lib/services/donor.service";

function donorFromForm(formData: FormData) {
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
  const donorId = formData.get("DonorID");
  const isEdit = donorId && String(donorId) !== "";
  try {
    const data = donorFromForm(formData);
    if (isEdit) {
      await donorService.updateDonor(Number(donorId), data);
      redirect("/donors?success=updated");
    } else {
      await donorService.createDonor(data);
      redirect("/donors?success=created");
    }
  } catch (error) {
    if (error instanceof ValidationError) {
      redirect(`/donors/${isEdit ? `${donorId}/edit` : "new"}?error=validation`);
    }
    redirect(`/donors?error=${isEdit ? "update_failed" : "create_failed"}`);
  }
}

export async function deleteDonorAction(donorId: number) {
  try {
    await donorService.deleteDonor(donorId);
    redirect("/donors?success=deleted");
  } catch (error) {
    if (error instanceof BusinessRuleError && error.code === "has_items") {
      redirect("/donors?error=has_items");
    }
    redirect("/donors?error=delete_failed");
  }
}
