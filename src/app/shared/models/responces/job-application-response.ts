import { JobApplicationStatus } from "../enums/applicationStatus";


export interface JobApplicationResponse {
  id: number;
  studentId: number;
  studentName: string;
  jobPostingId: number;
  companyName: string;
  jobTitle: string;
  status: JobApplicationStatus;
  motivationLetter: string;
  appliedAt: string;
  updatedAt: string;
}