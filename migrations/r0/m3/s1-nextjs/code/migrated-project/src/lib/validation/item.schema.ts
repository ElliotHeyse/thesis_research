import { z } from "zod";
import { ValidationError } from "@/lib/errors";

export const itemSchema = z.object({
  description: z.string().min(1, "Description is required.").max(75),
  retailValue: z.coerce.number({ error: "Retail Value must be a number." }),
  donorID: z.coerce.number({ error: "Donor is required." }).int().positive(),
  lotID: z
    .union([z.coerce.number().int().positive(), z.literal(-1), z.null()])
    .optional()
    .transform((val) => (val === -1 || val === undefined ? null : val)),
});

export type ItemFormData = z.infer<typeof itemSchema>;

export function parseItemInput(data: unknown): ItemFormData {
  const result = itemSchema.safeParse(data);
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
