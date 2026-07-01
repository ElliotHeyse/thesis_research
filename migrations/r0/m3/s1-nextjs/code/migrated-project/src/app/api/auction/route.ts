import { handleServiceError, jsonOk } from "@/lib/api/helpers";
import * as auctionService from "@/lib/services/auction.service";

export async function GET() {
  try {
    const data = await auctionService.getItemsGroupedByCategory();
    return jsonOk(data);
  } catch (error) {
    return handleServiceError(error);
  }
}
