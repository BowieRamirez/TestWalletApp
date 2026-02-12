import { z } from "zod";

/**
 * Shared Zod schemas for API response validation.
 * Using Zod v3 for ecosystem compatibility.
 */

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

export const accountSchema = z.object({
  id: z.string(),
  name: z.string(),
  balance: z.number(),
  accountNumber: z.string(),
  type: z.enum(["checking", "savings"]),
  currency: z.string().default("PHP"),
});

export const transactionSchema = z.object({
  id: z.string(),
  title: z.string(),
  date: z.string(),
  amount: z.number(),
  type: z.enum(["credit", "debit"]),
  category: z.string().optional(),
});

export const transferRequestSchema = z.object({
  recipientName: z.string().min(1, "Recipient name is required"),
  recipientAccountNumber: z
    .string()
    .min(6, "Account number must be at least 6 digits"),
  amount: z.number().positive("Amount must be positive"),
  currency: z.string().default("PHP"),
  pin: z.string().min(4, "PIN must be at least 4 digits").max(6),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Inferred types
export type UserSchema = z.infer<typeof userSchema>;
export type AccountSchema = z.infer<typeof accountSchema>;
export type TransactionSchema = z.infer<typeof transactionSchema>;
export type TransferRequestSchema = z.infer<typeof transferRequestSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
