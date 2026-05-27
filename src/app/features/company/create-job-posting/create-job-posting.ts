import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Footer } from '../../../shared/footer/footer';
import { Navbar } from '../../../shared/navbar/navbar';
import { AuthService } from '../../../services/AuthService';
import { JobpostingService } from '../../../services/jobposting.service';
import { WorkMode } from '../../../shared/models/enums/workmode';
import { EducationLevel } from '../../../shared/models/enums/educationLevel';
import { JobType } from '../../../shared/models/enums/jobtype';
import { CreateJobPostingRequest } from '../../../shared/models/requests/create-job-posting-request';

@Component({
  selector: 'app-create-job-posting',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule, Footer, Navbar],
  templateUrl: './create-job-posting.html',
  styleUrl: './create-job-posting.css',
})
export class CreateJobPosting  {
  private router = inject(Router);
  private authService = inject(AuthService);
  private jobPostingService = inject(JobpostingService);

  private companyId = this.authService.getCompanyId();

  jobTypes = Object.values(JobType);
  workModes = Object.values(WorkMode);
  educationLevels = Object.values(EducationLevel);

  isSubmitting = false;
  errorMessage: string | null = null;
  submitted = false;

  newSkill = '';
  skills: string[] = [];

  form = new FormGroup({
    jobTitle: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    jobType: new FormControl('', [Validators.required]),
    workMode: new FormControl('', [Validators.required]),
    location: new FormControl(''),
    requiredEducationLevel: new FormControl('', [Validators.required]),
    applicationDeadline: new FormControl('', [Validators.required])
  });

  addSkill(): void {
    const trimmed = this.newSkill.trim();
    if (trimmed && !this.skills.includes(trimmed)) {
      this.skills = [...this.skills, trimmed];
      this.newSkill = '';
    }
  }

  removeSkill(skill: string): void {
    this.skills = this.skills.filter(s => s !== skill);
  }

  submit(): void {
    if (this.form.invalid || this.isSubmitting) return;

    this.isSubmitting = true;
    this.errorMessage = null;

    const request: CreateJobPostingRequest = {
      jobTitle: this.form.value.jobTitle!,
      description: this.form.value.description ?? undefined,
      jobType: this.form.value.jobType  as JobType,
      workMode: this.form.value.workMode as WorkMode,
      location: this.form.value.location ?? undefined,
      requiredSkills: this.skills,
      requiredEducationLevel: this.form.value.requiredEducationLevel as EducationLevel,
      applicationDeadline: this.form.value.applicationDeadline!
    };


    if (this.companyId == null) {
  this.errorMessage = 'Company ID missing. Please login again.';
  this.isSubmitting = false;
  return;
}

    this.jobPostingService.createPosting(this.companyId, request).subscribe({
      next: () => {
        this.submitted = true;
        this.isSubmitting = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message ?? 'Something went wrong.';
        this.isSubmitting = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/company/company-dashboard']);
  }
}