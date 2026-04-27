import { VerificationStatus } from "./enums/verificationStatus";

export interface Company {
  id: number;

  // relation
  userId: number;

  // fields
  description?: string;
  domainOfActivity: string;
  websiteLink?: string;
  companySize: number;

  verificationStatus: VerificationStatus;
}