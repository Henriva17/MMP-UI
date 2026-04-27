import { EducationLevel } from "../enums/educationLevel";
import { JobType } from "../enums/jobtype";
import { WorkMode } from "../enums/workmode";

export interface CreateJobPostingRequest {
  jobTitle: string;

  description?: string;

  jobType: JobType;
  workMode: WorkMode;

  location?: string;

  requiredSkills?: string[];

  requiredEducationLevel: EducationLevel;

  applicationDeadline: string; // ISO date string (yyyy-MM-dd)
}