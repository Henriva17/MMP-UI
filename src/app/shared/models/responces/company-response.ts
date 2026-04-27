import { VerificationStatus } from "../enums/verificationStatus";

export interface CompanyResponse {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  description?: string;
  domainOfActivity: string;
  websiteLink?: string;
  companySize: number;
  verificationStatus: VerificationStatus;
}