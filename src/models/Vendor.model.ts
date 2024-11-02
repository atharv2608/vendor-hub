import mongoose, { Schema, Document } from "mongoose";

export enum CriticalityStatus {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export enum AccountStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  PENDING = "pending",
}

export enum VendorType {
  SUPPLIER = "supplier",
  SERVICEPROVIDER = "service provider",
  LOGISTICS = "logistics",
}
export interface Vendor extends Document {
  name: string;
  type: VendorType;
  contact: string;
  criticality: CriticalityStatus;
  accountStatus: AccountStatus;
  serviceProvided: string;
}

const VendorSchema: Schema<Vendor> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    type: {
      type: String,
      enum: Object.values(VendorType),
      required: [true, "Vendor Type is required"],
    },
    criticality: {
      type: String,
      enum: Object.values(CriticalityStatus),
      required: [true, "Criticality is required"],
    },
    contact: {
      type: String,
      required: [true, "Contact is required"],
      unique: true,
      lowercase: true,
      match: [/.+\@.+\..+/, "Invalid email!"],
    },
    serviceProvided: {
      type: String,
      required: [true, "Service provided is required"],
    },
    accountStatus: {
      type: String,
      enum: Object.values(AccountStatus),
      default: AccountStatus.PENDING,
    },
  },
  {
    timestamps: true,
  }
);

const VendorModel =
  (mongoose.models.Vendor as mongoose.Model<Vendor>) ||
  mongoose.model<Vendor>("Vendor", VendorSchema);

export default VendorModel;
