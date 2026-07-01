import { z } from "zod";
import { ValidationError } from "@/lib/errors";

export const lotSchema = z.object({
  description: z.string().min(1, "Description is required").max(75),
  categoryID: z
    .union([z.coerce.number().int().positive(), z.literal(-1), z.null()])
    .optional()
    .transform((val) => (val === -1 || val === undefined ? null : val)),
  winningBid: z
    .union([
      z.coerce.number().nonnegative("Highest bid must be greater than 0"),
      z.literal(""),
      z.null(),
    ])
    .optional()
    .transform((val) => (val === "" || val === undefined ? null : val)),
  winningBidder: z
    .union([z.coerce.number().int().positive(), z.literal(-1), z.null()])
    .optional()
    .transform((val) => (val === -1 || val === undefined ? null : val)),
  delivered: z.boolean().optional(),
  image: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) =>
        !val ||
        (() => {
          try {
            const url = new URL(val);
            return url.protocol === "http:" || url.protocol === "https:";
          } catch {
            return false;
          }
        })(),
      "Image URL must start with http:// or https://",
    )
    .transform((val) => val || null),
});

export type LotFormData = z.infer<typeof lotSchema>;

export function parseLotInput(data: unknown): LotFormData {
  const result = lotSchema.safeParse(data);
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
