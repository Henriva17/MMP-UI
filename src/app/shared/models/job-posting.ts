import { EducationLevel } from "./enums/educationLevel";
import { JobPostingStatus } from "./enums/jobPostingStatus";
import { JobType } from "./enums/jobtype";
import { WorkMode } from "./enums/workmode";

export interface JobPosting {
  id: number;

  jobTitle: string;
  description: string;

  location: string;

  jobType: JobType;        // INTERNSHIP, FULL_TIME, etc.
  workMode: WorkMode;       // REMOTE, HYBRID, ON_SITE

  requiredSkills: string[];

  requiredEducationLevel: EducationLevel;

  applicationDeadline: string;

  jobPostingStatus: JobPostingStatus; // DRAFT, OPEN, CLOSED, ARCHIVED

  createdAt: string;
  updatedAt: string;

  

  companyName: string; // 


}
