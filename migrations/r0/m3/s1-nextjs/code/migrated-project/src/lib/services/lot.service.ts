import * as categoryRepo from "@/lib/repositories/category.repository";
import * as lotRepo from "@/lib/repositories/lot.repository";
import { parseLotInput } from "@/lib/validation/lot.schema";

export async function listLots() {
  return lotRepo.findAllLots();
}

export async function getLot(lotId: number) {
  return lotRepo.findLotById(lotId);
}

export async function getLotDetail(lotId: number) {
  const lot = await lotRepo.findLotById(lotId);
  if (!lot) return null;
  const category = lot.CategoryID
    ? await categoryRepo.findCategoryById(lot.CategoryID)
    : null;
  let winner: string | null = null;
  if (lot.WinningBidder) {
    const bidders = await lotRepo.findAllBidders();
    winner = bidders.find((b) => b.BidderID === lot.WinningBidder)?.Name ?? null;
  }
  return { lot: { ...lot, Winner: winner }, category };
}

export async function listBiddersForSelect() {
  return lotRepo.findAllBidders();
}

export async function createLot(data: unknown) {
  const parsed = parseLotInput(data);
  await lotRepo.createLot({
    description: parsed.description,
    categoryID: parsed.categoryID,
    winningBid: parsed.winningBid,
    winningBidder: parsed.winningBidder,
    delivered: parsed.delivered,
    image: parsed.image,
  });
}

export async function updateLot(lotId: number, data: unknown) {
  const parsed = parseLotInput(data);
  await lotRepo.updateLot(lotId, {
    description: parsed.description,
    categoryID: parsed.categoryID,
    winningBid: parsed.winningBid,
    winningBidder: parsed.winningBidder,
    delivered: parsed.delivered,
    image: parsed.image,
  });
}

export async function deleteLot(lotId: number) {
  await lotRepo.deleteLot(lotId);
}

export async function listCategoriesForSelect() {
  return categoryRepo.findAllCategories();
}
