import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { JobPostingResponse } from '../../shared/models/responces/job-posting-response';
import { JobpostingService } from '../../services/jobposting.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  selectedOption = '/jobs';

  jobPostings: JobPostingResponse[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    private jobpostingService: JobpostingService,
    private router: Router
  ) {}

  navigate(value: string): void {
    if (value.startsWith('/')) {
      this.router.navigate([value]);
    } else if (value.startsWith('#')) {
      window.location.hash = value;
    }
  }

  ngOnInit(): void {
    this.loadOpenJobs();
  }

  loadOpenJobs(): void {
    this.loading = true;
    this.errorMessage = '';

    this.jobpostingService.getOpenPostings().subscribe({
      next: (data) => {
        this.jobPostings = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('JOB API ERROR:', error);
        this.errorMessage = 'Failed to load job postings.';
        this.loading = false;
      }
    });
  }
}