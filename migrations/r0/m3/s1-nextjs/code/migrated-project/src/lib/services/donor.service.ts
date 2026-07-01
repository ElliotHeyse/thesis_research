import { BusinessRuleError } from "@/lib/errors";
import * as donorRepo from "@/lib/repositories/donor.repository";
import type { Donor, DonorInput } from "@/lib/types";
import { parseDonorInput } from "@/lib/validation/donor.schema";

export async function listDonors() {
  return donorRepo.findAllDonors();
}

export async function getDonor(donorId: number) {
  return donorRepo.findDonorById(donorId);
}

export async function listDonorsForSelect() {
  return donorRepo.findDonorsForSelect();
}

export async function listPendingReceipts() {
  return donorRepo.findDonorsWithoutReceipt();
}

export async function listEligibleForReceipt(): Promise<Donor[]> {
  const allDonors = await donorRepo.findAllDonors();
  const eligible: Donor[] = [];
  for (const donor of allDonors) {
    const items = await donorRepo.findItemsByDonorId(donor.DonorID);
    if (items.length > 0 && !donor.TaxReceipt) {
      eligible.push(donor);
    }
  }
  return eligible;
}

export async function createDonor(data: unknown) {
  const parsed = parseDonorInput(data);
  await donorRepo.createDonor(toDonorInput(parsed));
}

export async function updateDonor(donorId: number, data: unknown) {
  const parsed = parseDonorInput(data);
  await donorRepo.updateDonor(donorId, toDonorInput(parsed));
}

export async function deleteDonor(donorId: number) {
  if (await donorRepo.donorHasItems(donorId)) {
    throw new BusinessRuleError(
      "Cannot delete donor with associated items.",
      "has_items",
    );
  }
  await donorRepo.deleteDonor(donorId);
}

export async function prepareLettersPdfData(donorIds: number[]) {
  const donors: Donor[] = [];
  for (const id of donorIds) {
    const donor = await donorRepo.findDonorById(id);
    if (donor) donors.push(donor);
  }
  return donors;
}

export async function generateReceipts(donorIds: number[]) {
  const result: { donor: Donor; items: Awaited<ReturnType<typeof donorRepo.findItemsByDonorId>> }[] = [];
  for (const id of donorIds) {
    const donor = await donorRepo.findDonorById(id);
    if (donor) {
      const items = await donorRepo.findItemsByDonorId(id);
      result.push({ donor, items });
      await donorRepo.markReceiptSent(id);
    }
  }
  return result;
}

function toDonorInput(parsed: ReturnType<typeof parseDonorInput>): DonorInput {
  return {
    businessName: parsed.businessName || undefined,
    contactName: parsed.contactName,
    contactEmail: parsed.contactEmail,
    contactTitle: parsed.contactTitle || undefined,
    address: parsed.address,
    city: parsed.city,
    state: parsed.state,
    zipCode: parsed.zipCode,
    taxReceipt: parsed.taxReceipt,
  };
}
