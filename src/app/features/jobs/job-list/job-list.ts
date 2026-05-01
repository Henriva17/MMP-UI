import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { JobpostingService } from '../../../services/jobposting.service';
import { JobPosting } from '../../../shared/models/job-posting';
import { JobPostingResponse } from '../../../shared/models/responces/job-posting-response';

@Component({
  selector: 'app-job-list',
  standalone:true,
  imports: [CommonModule, RouterLink],
  templateUrl: './job-list.html',
  styleUrl: './job-list.css',
})
export class JobList implements OnInit {

  private jobService = inject(JobpostingService);

 jobs: JobPostingResponse[] = [];
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.jobService.getOpenPostings().subscribe({
      next: (data) => {
        this.jobs = data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load jobs.';
        this.isLoading = false;
      }
    });
  }
}
