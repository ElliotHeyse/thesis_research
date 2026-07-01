import {
  handleServiceError,
  jsonOk,
  parseJsonBody,
} from "@/lib/api/helpers";
import * as lotService from "@/lib/services/lot.service";

export async function GET() {
  try {
    const lots = await lotService.listLots();
    return jsonOk(lots);
  } catch (error) {
    return handleServiceError(error);
  }
}

export async function POST(request: Request) {
  try {
    const data = await parseJsonBody(request);
    await lotService.createLot(data);
    return jsonOk({ success: true }, 201);
  } catch (error) {
    return handleServiceError(error);
  }
}
