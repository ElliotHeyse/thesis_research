import { NextResponse } from "next/server";
import { BusinessRuleError, ValidationError } from "@/lib/errors";

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function handleServiceError(error: unknown) {
  if (error instanceof ValidationError) {
    return NextResponse.json(
      { error: error.message, fieldErrors: error.fieldErrors },
      { status: 400 },
    );
  }
  if (error instanceof BusinessRuleError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: 409 },
    );
  }
  console.error(error);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}

export function redirectWithFlash(
  path: string,
  type: "success" | "error",
  code: string,
) {
  const url = new URL(path, "http://localhost");
  url.searchParams.set(type, code);
  return NextResponse.redirect(url.pathname + url.search);
}

export function parseIdParam(value: string): number | null {
  const id = Number(value);
  return Number.isFinite(id) && id > 0 ? id : null;
}

export async function parseJsonBody<T>(request: Request): Promise<T | null> {
  try {
    return (await request.json()) as T;
  } catch {
    return null;
  }
}

export function parseDonorIdsFromBody(body: FormData | Record<string, unknown>): number[] {
  if (body instanceof FormData) {
    const ids = [
      ...body.getAll("donorIds"),
      ...body.getAll("donorIds[]"),
    ];
    return ids.map((id) => Number(id)).filter((id) => Number.isFinite(id));
  }
  const raw = body.donorIds;
  if (Array.isArray(raw)) {
    return raw.map((id) => Number(id)).filter((id) => Number.isFinite(id));
  }
  return [];
}
