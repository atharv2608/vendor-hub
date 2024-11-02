
import {z} from "zod"

export const addVendorSchema =  z.object({
    name: z.string().min(1, {message: "Name is required"}),
    contact: z.string().email({message: "Email is invalid"}),
    serviceProvided: z.string().min(1, {message: "Service provided is required"}),
    type: z.enum(["supplier", "service provider", "logistics"]),
    criticality:  z.enum(["high", "low", "medium", "critical"])
})

export const updateVendorSchema = z.object({
    _id: z.string(),
    contact: z.string().email({message: "Email is invalid"}),
    accountStatus: z.enum(["active", "inactive", "pending"]),
    criticality:  z.enum(["high", "low", "medium", "critical"])
})