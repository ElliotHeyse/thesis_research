"use server";

import { redirect } from "next/navigation";
import { ValidationError } from "@/lib/errors";
import * as lotService from "@/lib/services/lot.service";

function lotFromForm(formData: FormData) {
  const categoryRaw = formData.get("CategoryID");
  const bidderRaw = formData.get("BidderID");
  const bidRaw = formData.get("HighestBid");
  return {
    description: String(formData.get("Description") ?? ""),
    categoryID:
      categoryRaw && String(categoryRaw) !== "" ? Number(categoryRaw) : null,
    winningBid:
      bidRaw && String(bidRaw) !== "" ? Number(bidRaw) : null,
    winningBidder:
      bidderRaw && String(bidderRaw) !== "" ? Number(bidderRaw) : null,
    delivered: formData.get("Delivered") === "on",
    image: String(formData.get("Image") ?? "") || null,
  };
}

export async function saveLotAction(formData: FormData) {
  const lotId = formData.get("LotID");
  const isEdit = lotId && String(lotId) !== "" && String(lotId) !== "null";
  try {
    const data = lotFromForm(formData);
    if (isEdit) {
      await lotService.updateLot(Number(lotId), data);
    } else {
      await lotService.createLot(data);
    }
    redirect("/lots?success=updated");
  } catch (error) {
    if (error instanceof ValidationError) {
      redirect(`/lots/${isEdit ? `${lotId}/edit` : "new"}?error=validation`);
    }
    redirect("/lots?error=update_failed");
  }
}

export async function deleteLotAction(lotId: number) {
  try {
    await lotService.deleteLot(lotId);
    redirect("/lots?success=deleted");
  } catch {
    redirect("/lots?error=delete_failed");
  }
}
