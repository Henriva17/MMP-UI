import { Component, inject } from '@angular/core';
import { Footer } from '../../shared/footer/footer';
import { Navbar } from '../../shared/navbar/navbar';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/AuthService';
import { JobApplicationService } from '../../services/job-application.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApplyToJobRequest } from '../../shared/models/requests/job-application-request';
import { JobpostingService } from '../../services/jobposting.service';
import { JobPostingResponse } from '../../shared/models/responces/job-posting-response';

@Component({
  selector: 'app-apply-job',
  imports: [CommonModule,RouterLink, ReactiveFormsModule, Navbar, Footer],
  templateUrl: './apply-job.html',
  styleUrl: './apply-job.css',
})
export class ApplyJob {
  job?: JobPostingResponse;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private jobApplicationService = inject(JobApplicationService);

  constructor(
    private jobPostingService: JobpostingService
  ) {}

  readonly jobPostingId = Number(this.route.snapshot.paramMap.get('id'));
  readonly studentId = this.authService.getStudentId();
  readonly fullName = this.authService.getFullName();

  form = new FormGroup({
    motivationLetter: new FormControl('', [
      Validators.required,
      Validators.minLength(50),
      Validators.maxLength(3000)
    ])
  });

  isSubmitting = false;
  errorMessage: string | null = null;
  submitted = false;

  get letterControl() {
    return this.form.controls.motivationLetter;
  }

  get charCount(): number {
    return this.letterControl.value?.length ?? 0;
  }

  ngOnInit(): void {
  const jobId = Number(this.route.snapshot.paramMap.get('id'));

  this.jobPostingService.getById(jobId).subscribe({
    next: (job) => {
      this.job = job;
    },
    error: (err) => {
      console.error('Failed to load job', err);
    }
  });
}

  submit(): void {
    if (this.form.invalid || this.isSubmitting) return;

    this.isSubmitting = true;
    this.errorMessage = null;

    const request: ApplyToJobRequest = {
      jobPostingId: this.jobPostingId,
      motivationLetter: this.letterControl.value!
    };


    if (this.studentId == null) {
  this.errorMessage = 'Student ID missing. Please login again.';
  this.isSubmitting = false;
  return;
}
  

    this.jobApplicationService.apply(this.studentId, request).subscribe({
      next: () => {
        this.submitted = true;
        this.isSubmitting = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message ?? 'Something went wrong. Please try again.';
        this.isSubmitting = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/jobs', this.jobPostingId]);
  }
  viewMyApplication(): void {
  this.router.navigate(['student-dashboard'], { queryParams: { tab: 'applications' } });
}
}