import {
  handleServiceError,
  jsonOk,
  parseJsonBody,
} from "@/lib/api/helpers";
import * as categoryService from "@/lib/services/category.service";

export async function GET() {
  try {
    const categories = await categoryService.listCategories();
    return jsonOk(categories);
  } catch (error) {
    return handleServiceError(error);
  }
}

export async function POST(request: Request) {
  try {
    const data = await parseJsonBody(request);
    await categoryService.createCategory(data);
    return jsonOk({ success: true }, 201);
  } catch (error) {
    return handleServiceError(error);
  }
}
