import {
  handleServiceError,
  jsonOk,
  parseIdParam,
  parseJsonBody,
} from "@/lib/api/helpers";
import * as lotService from "@/lib/services/lot.service";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const id = parseIdParam((await params).id);
    if (!id) return jsonOk({ error: "Invalid ID" }, 400);
    const detail = await lotService.getLotDetail(id);
    if (!detail) return jsonOk({ error: "Not found" }, 404);
    return jsonOk(detail);
  } catch (error) {
    return handleServiceError(error);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const id = parseIdParam((await params).id);
    if (!id) return jsonOk({ error: "Invalid ID" }, 400);
    const data = await parseJsonBody(request);
    await lotService.updateLot(id, data);
    return jsonOk({ success: true });
  } catch (error) {
    return handleServiceError(error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const id = parseIdParam((await params).id);
    if (!id) return jsonOk({ error: "Invalid ID" }, 400);
    await lotService.deleteLot(id);
    return jsonOk({ success: true });
  } catch (error) {
    return handleServiceError(error);
  }
}
