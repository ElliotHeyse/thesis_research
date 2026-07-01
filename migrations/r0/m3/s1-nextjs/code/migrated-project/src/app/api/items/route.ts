import {
  handleServiceError,
  jsonOk,
  parseJsonBody,
} from "@/lib/api/helpers";
import * as itemService from "@/lib/services/item.service";

export async function GET() {
  try {
    const data = await itemService.listItemsWithLots();
    return jsonOk(data);
  } catch (error) {
    return handleServiceError(error);
  }
}

export async function POST(request: Request) {
  try {
    const data = await parseJsonBody(request);
    await itemService.createItem(data);
    return jsonOk({ success: true }, 201);
  } catch (error) {
    return handleServiceError(error);
  }
}
