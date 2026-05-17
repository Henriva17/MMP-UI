import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { Footer } from "../../../shared/footer/footer";
import { Navbar } from "../../../shared/navbar/navbar";
import { AuthService } from "../../../services/AuthService";
import { CompanyService } from "../../../services/company.service";
import { CompanyResponse } from "../../../shared/models/responces/company-response";
import { JobPostingResponse } from "../../../shared/models/responces/job-posting-response";
import { JobpostingService } from "../../../services/jobposting.service";
import { JobApplicationResponse } from "../../../shared/models/responces/job-application-response";
import { JobApplicationService } from "../../../services/job-application.service";
import { JobApplicationStatus } from "../../../shared/models/enums/applicationStatus";

@Component({
  selector: 'app-company-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, Footer, Navbar],
  templateUrl: './company-dashboard.html',
  styleUrl: './company-dashboard.css',
})
export class CompanyDashboard implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  private companyService = inject(CompanyService);
  private jobPostingService = inject(JobpostingService);
  private jobApplicationService = inject(JobApplicationService);


  company: CompanyResponse | null = null;
  isLoading = true;
  activeTab: 'jobs' | 'applications' = 'jobs';

  private companyId = this.authService.getCompanyId();

  jobPostings: JobPostingResponse[] = [];
isLoadingJobs = false;

applications: JobApplicationResponse[] = [];
isLoadingApplications = false;

ngOnInit(): void {
  // Guard against null
  if (!this.companyId) {
    this.router.navigate(['/login']);
    return;
  }

  this.companyService.getById(this.companyId).subscribe({
    next: (data) => {
      this.company = data;
      this.isLoading = false;
    },
    error: () => this.isLoading = false
  });

  this.loadJobs();
}

loadJobs(): void {
  if (!this.companyId) return;  // ← guard

  this.isLoadingJobs = true;
  this.jobPostingService.getByCompany(this.companyId).subscribe({  // ← fixed this.id → this.companyId
    next: (data) => {
      this.jobPostings = data;
      this.isLoadingJobs = false;
    },
    error: () => this.isLoadingJobs = false
  });
}

loadApplications(): void {
  if (!this.companyId) return;  // ← guard

  this.isLoadingApplications = true;
  this.jobApplicationService.getByCompany(this.companyId).subscribe({
    next: (data) => {
      this.applications = data;
      this.isLoadingApplications = false;
    },
    error: () => this.isLoadingApplications = false
  });
}

  onTabChange(tab: 'jobs' | 'applications'): void {
  this.activeTab = tab;
  if (tab === 'jobs' && this.jobPostings.length === 0) {
    this.loadJobs();
  }
  if (tab === 'applications' && this.applications.length === 0) {
    this.loadApplications();
  }
}

getStatusClass(status: JobApplicationStatus): string {
  const map: Record<string, string> = {
    PENDING:   'bg-warning-subtle text-warning',
    REVIEWED:  'bg-info-subtle text-info',
    ACCEPTED:  'bg-success-subtle text-success',
    REJECTED:  'bg-danger-subtle text-danger',
    WITHDRAWN: 'bg-secondary-subtle text-secondary'
  };
  return map[status] ?? 'bg-secondary-subtle text-secondary';
}

review(id: number): void {
  this.jobApplicationService.review(id).subscribe({
    next: (updated) => this.updateApplication(updated)
  });
}

accept(id: number): void {
  this.jobApplicationService.accept(id).subscribe({
    next: (updated) => this.updateApplication(updated)
  });
}

reject(id: number): void {
  this.jobApplicationService.reject(id).subscribe({
    next: (updated) => this.updateApplication(updated)
  });
}

private updateApplication(updated: JobApplicationResponse): void {
  this.applications = this.applications.map(a =>
    a.id === updated.id ? updated : a
  );
}
}