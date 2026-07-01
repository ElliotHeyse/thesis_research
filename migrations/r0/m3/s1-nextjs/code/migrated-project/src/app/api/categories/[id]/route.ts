import {
  handleServiceError,
  jsonOk,
  parseIdParam,
  parseJsonBody,
} from "@/lib/api/helpers";
import * as categoryService from "@/lib/services/category.service";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const id = parseIdParam((await params).id);
    if (!id) return jsonOk({ error: "Invalid ID" }, 400);
    const category = await categoryService.getCategory(id);
    if (!category) return jsonOk({ error: "Not found" }, 404);
    return jsonOk(category);
  } catch (error) {
    return handleServiceError(error);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const id = parseIdParam((await params).id);
    if (!id) return jsonOk({ error: "Invalid ID" }, 400);
    const data = await parseJsonBody(request);
    await categoryService.updateCategory(id, data);
    return jsonOk({ success: true });
  } catch (error) {
    return handleServiceError(error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const id = parseIdParam((await params).id);
    if (!id) return jsonOk({ error: "Invalid ID" }, 400);
    await categoryService.deleteCategory(id);
    return jsonOk({ success: true });
  } catch (error) {
    return handleServiceError(error);
  }
}
