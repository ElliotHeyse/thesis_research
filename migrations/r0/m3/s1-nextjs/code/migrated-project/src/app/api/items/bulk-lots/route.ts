import { NextResponse } from "next/server";
import { handleServiceError, jsonOk, parseJsonBody } from "@/lib/api/helpers";
import * as itemService from "@/lib/services/item.service";

export async function PATCH(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    let assignments: Record<string, string | number> = {};

    if (contentType.includes("application/json")) {
      const body = await parseJsonBody<{ assignments?: Record<string, string | number> }>(request);
      assignments = body?.assignments ?? {};
    } else {
      const form = await request.formData();
      for (const [key, value] of form.entries()) {
        if (key.startsWith("LotID[") || key.match(/^LotID\[\d+\]$/)) {
          const match = key.match(/\[(\d+)\]/);
          if (match) {
            assignments[match[1]] = String(value);
          }
        } else if (key === "LotID") {
          // flat form from nested names LotID[itemId]
        }
      }
      // Handle LotID as object from FormData with bracket notation
      for (const [key, value] of form.entries()) {
        const m = key.match(/^LotID\[(\d+)\]$/);
        if (m) assignments[m[1]] = String(value);
      }
    }

    await itemService.bulkAssignLots(assignments);
    return jsonOk({ success: true });
  } catch (error) {
    return handleServiceError(error);
  }
}

export async function POST(request: Request) {
  const response = await PATCH(request);
  if (response.ok) {
    return NextResponse.redirect(new URL("/lots/items?success=updated", request.url));
  }
  return NextResponse.redirect(new URL("/lots/items?error=update_failed", request.url));
}
