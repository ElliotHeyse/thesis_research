import { z } from "zod";
import { ValidationError } from "@/lib/errors";

export const categorySchema = z.object({
  description: z.string().min(1, "Description is required").max(75),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

export function parseCategoryInput(data: unknown): CategoryFormData {
  const result = categorySchema.safeParse(data);
  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] = issue.message;
    }
    throw new ValidationError("Validation failed", fieldErrors);
  }
  return result.data;
}
