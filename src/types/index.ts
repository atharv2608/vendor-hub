export type Vendor = {
  _id: string;
  name: string;
  contact: string;
  type: string;
  criticality: string;
  serviceProvided: string;
  accountStatus: string;
};

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