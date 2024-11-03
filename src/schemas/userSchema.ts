import { z } from "zod";

export const userSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Email is invalid" }),
    phone: z.string().min(10, { message: "Number should be of 10 digits" }),
    password: z
      .string()
      .min(6, { message: "Password must be of minimum 6 characters" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be of minimum 6 characters" }),
    canManageUsers: z.boolean(),
    canManageVendors: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Specify which field to show the error on
  });
