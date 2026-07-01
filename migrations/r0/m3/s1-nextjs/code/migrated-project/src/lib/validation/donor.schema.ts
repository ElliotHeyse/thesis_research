import { z } from "zod";
import { ValidationError } from "@/lib/errors";

export const donorSchema = z.object({
  businessName: z.string().max(75).optional().or(z.literal("")),
  contactName: z.string().min(1, "Contact Name is required.").max(75),
  contactEmail: z
    .string()
    .max(200)
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      "Invalid email format.",
    ),
  contactTitle: z.string().max(75).optional().or(z.literal("")),
  address: z.string().max(75).optional().or(z.literal("")),
  city: z.string().max(30).optional().or(z.literal("")),
  state: z.string().max(2).optional().or(z.literal("")),
  zipCode: z
    .string()
    .max(5)
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => !val || /^\d+$/.test(val),
      "Zip Code must be numeric.",
    ),
  taxReceipt: z.boolean().optional(),
});

export type DonorFormData = z.infer<typeof donorSchema>;

export function parseDonorInput(data: unknown): DonorFormData {
  const result = donorSchema.safeParse(data);
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
