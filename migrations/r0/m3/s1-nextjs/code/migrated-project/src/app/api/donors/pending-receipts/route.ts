import { handleServiceError, jsonOk } from "@/lib/api/helpers";
import * as donorService from "@/lib/services/donor.service";

export async function GET() {
  try {
    const donors = await donorService.listPendingReceipts();
    return jsonOk(donors);
  } catch (error) {
    return handleServiceError(error);
  }
}
