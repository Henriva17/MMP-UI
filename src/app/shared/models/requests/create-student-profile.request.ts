import { EducationLevel } from "../enums/educationLevel";

export interface CreateStudentProfileRequest {
  studentMat: string;
  bio: string;
  fieldOfStudy: string;
  educationLevel: EducationLevel;
  graduationYear: number;
  university: string;
  skills: string[];
  githubLink: string;
  portfolioLink: string;
  cvFilePath: string;
}