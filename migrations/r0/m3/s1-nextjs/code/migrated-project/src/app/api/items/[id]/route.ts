import {
  handleServiceError,
  jsonOk,
  parseIdParam,
  parseJsonBody,
} from "@/lib/api/helpers";
import * as itemService from "@/lib/services/item.service";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const id = parseIdParam((await params).id);
    if (!id) return jsonOk({ error: "Invalid ID" }, 400);
    const item = await itemService.getItem(id);
    if (!item) return jsonOk({ error: "Not found" }, 404);
    return jsonOk(item);
  } catch (error) {
    return handleServiceError(error);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const id = parseIdParam((await params).id);
    if (!id) return jsonOk({ error: "Invalid ID" }, 400);
    const data = await parseJsonBody(request);
    await itemService.updateItem(id, data);
    return jsonOk({ success: true });
  } catch (error) {
    return handleServiceError(error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const id = parseIdParam((await params).id);
    if (!id) return jsonOk({ error: "Invalid ID" }, 400);
    await itemService.deleteItem(id);
    return jsonOk({ success: true });
  } catch (error) {
    return handleServiceError(error);
  }
}
