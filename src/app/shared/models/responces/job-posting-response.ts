import { EducationLevel } from "../enums/educationLevel";
import { JobPostingStatus } from "../enums/jobPostingStatus";
import { JobType } from "../enums/jobtype";
import { WorkMode } from "../enums/workmode";

export interface JobPostingResponse {
  id: number;

  companyId: number;
  companyName: string;

  jobTitle: string;
  description?: string;

  jobType: JobType;
  workMode: WorkMode;

  location?: string;

  requiredSkills: string[];

  requiredEducationLevel: EducationLevel;

  applicationDeadline: string; // yyyy-MM-dd

  status: JobPostingStatus;

  createdAt: string;   // ISO datetime
  updatedAt: string;   // ISO datetime
}