import {
  handleServiceError,
  jsonOk,
  parseIdParam,
  parseJsonBody,
} from "@/lib/api/helpers";
import * as donorService from "@/lib/services/donor.service";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const id = parseIdParam((await params).id);
    if (!id) return jsonOk({ error: "Invalid ID" }, 400);
    const donor = await donorService.getDonor(id);
    if (!donor) return jsonOk({ error: "Not found" }, 404);
    return jsonOk(donor);
  } catch (error) {
    return handleServiceError(error);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const id = parseIdParam((await params).id);
    if (!id) return jsonOk({ error: "Invalid ID" }, 400);
    const data = await parseJsonBody(request);
    await donorService.updateDonor(id, data);
    return jsonOk({ success: true });
  } catch (error) {
    return handleServiceError(error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const id = parseIdParam((await params).id);
    if (!id) return jsonOk({ error: "Invalid ID" }, 400);
    await donorService.deleteDonor(id);
    return jsonOk({ success: true });
  } catch (error) {
    return handleServiceError(error);
  }
}
