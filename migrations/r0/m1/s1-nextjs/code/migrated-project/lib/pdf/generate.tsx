import { renderToBuffer } from "@react-pdf/renderer";
import path from "path";
import {
  BiddingSheetDocument,
  DonorLettersDocument,
  TaxReceiptsDocument,
} from "@/lib/pdf/documents";
import {
  getDonor,
  getItemsByDonorId,
  markReceiptSent,
} from "@/lib/repositories/donors";
import {
  getCategoryForBiddingSheet,
  getItemById,
  getLotForBiddingSheet,
} from "@/lib/repositories/items";

export async function generateDonorLettersPdf(
  donorIds: number[],
): Promise<Buffer | null> {
  const donors = [];
  for (const id of donorIds) {
    const donor = await getDonor(id);
    if (donor) donors.push(donor);
  }
  if (donors.length === 0) return null;
  return renderToBuffer(<DonorLettersDocument donors={donors} />);
}

export async function generateTaxReceiptsPdf(
  donorIds: number[],
): Promise<Buffer | null> {
  const data = [];
  for (const id of donorIds) {
    const donor = await getDonor(id);
    if (donor) {
      const items = await getItemsByDonorId(id);
      data.push({ donor, items });
      await markReceiptSent(id);
    }
  }
  if (data.length === 0) return null;

  const logoPath = path.join(
    process.cwd(),
    "public",
    "Tiger-icon-hi-res.svg",
  );

  return renderToBuffer(
    <TaxReceiptsDocument data={data} logoPath={logoPath} />,
  );
}

export async function generateBiddingSheetPdf(
  itemId: number,
  options?: {
    startingBid?: number;
    bidIncrement?: number;
    rows?: number;
  },
): Promise<Buffer | null> {
  const item = await getItemById(itemId);
  if (!item) return null;

  let lot = null;
  let category = null;
  if (item.LotID) {
    lot = await getLotForBiddingSheet(item.LotID);
    if (lot?.CategoryID) {
      category = await getCategoryForBiddingSheet(lot.CategoryID);
    }
  }

  const retailValue = Number(item.RetailValue ?? 0);
  const startingBid =
    options?.startingBid ??
    (retailValue > 0 ? retailValue * 0.5 : 10);
  const bidIncrement = options?.bidIncrement ?? 5;
  const numberOfBidRows = options?.rows ?? 15;

  return renderToBuffer(
    <BiddingSheetDocument
      item={item}
      lot={lot}
      category={category}
      startingBid={startingBid}
      bidIncrement={bidIncrement}
      numberOfBidRows={numberOfBidRows}
    />,
  );
}
