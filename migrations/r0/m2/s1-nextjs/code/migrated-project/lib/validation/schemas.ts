import { z } from "zod";

export const donorSchema = z.object({
  businessName: z.string().max(75, "Business Name cannot exceed 75 characters."),
  contactName: z
    .string()
    .min(1, "Contact Name is required.")
    .max(75, "Contact Name cannot exceed 75 characters."),
  contactEmail: z
    .string()
    .max(200, "Email cannot exceed 200 characters.")
    .refine((v) => !v || z.string().email().safeParse(v).success, {
      message: "Invalid email format.",
    }),
  contactTitle: z
    .string()
    .max(75, "Contact Title cannot exceed 75 characters."),
  address: z.string().max(75, "Address cannot exceed 75 characters."),
  city: z.string().max(30, "City cannot exceed 30 characters."),
  state: z.string().max(2, "State cannot exceed 2 characters."),
  zipCode: z
    .string()
    .max(5, "Zip Code cannot exceed 5 characters.")
    .refine((v) => !v || /^\d+$/.test(v), {
      message: "Zip Code must be numeric.",
    }),
  taxReceipt: z.boolean().optional(),
});

export type DonorSchemaInput = z.infer<typeof donorSchema>;

export const itemSchema = z.object({
  description: z
    .string()
    .min(1, "Description is required.")
    .max(75, "Description cannot exceed 75 characters."),
  retailValue: z.coerce.number({
    message: "Retail Value must be a number.",
  }),
  donorID: z.coerce
    .number({ message: "Donor is required." })
    .int()
    .positive("Donor is required."),
  lotID: z
    .union([z.coerce.number().int().positive(), z.literal(-1), z.null()])
    .optional()
    .transform((v) => (v === -1 || v === undefined || v === null ? null : v)),
});

export type ItemSchemaInput = z.infer<typeof itemSchema>;

export const lotSchema = z.object({
  description: z
    .string()
    .min(1, "Description is required")
    .max(75, "Description cannot exceed 75 characters"),
  categoryId: z
    .union([z.coerce.number().int().positive(), z.literal(""), z.null()])
    .optional()
    .transform((v) => (v === "" || v === null || v === undefined ? null : v)),
  highestBid: z
    .union([z.coerce.number().nonnegative(), z.literal(""), z.null()])
    .optional()
    .transform((v) => (v === "" || v === null || v === undefined ? null : v)),
  bidderId: z
    .union([z.coerce.number().int().positive(), z.literal(""), z.null()])
    .optional()
    .transform((v) => (v === "" || v === null || v === undefined ? null : v)),
  delivered: z.boolean().optional().default(false),
  image: z
    .string()
    .optional()
    .transform((v) => (v === "" || v === undefined ? null : v))
    .refine((v) => !v || /^https?:\/\/.+$/.test(v), {
      message: "Image URL must start with http:// or https://",
    }),
});

export type LotSchemaInput = z.infer<typeof lotSchema>;

export const categorySchema = z.object({
  description: z
    .string()
    .min(1, "Description is required")
    .max(75, "Description cannot exceed 75 characters"),
});

export type CategorySchemaInput = z.infer<typeof categorySchema>;

export function fieldErrors(
  error: z.ZodError
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "");
    if (key && !errors[key]) {
      errors[key] = issue.message;
    }
  }
  return errors;
}
