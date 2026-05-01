import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { JobpostingService } from '../../../services/jobposting.service';
import { JobPostingResponse } from '../../../shared/models/responces/job-posting-response';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './job-detail.html',
  styleUrl: './job-detail.css',
})
export class JobDetail implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private jobService = inject(JobpostingService);

  job: JobPostingResponse | null = null;
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.router.navigate(['/jobs']);
      return;
    }

    this.jobService.getById(id).subscribe({
      next: (data) => {
        this.job = data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load job details.';
        this.isLoading = false;
      }
    });
  }
}

