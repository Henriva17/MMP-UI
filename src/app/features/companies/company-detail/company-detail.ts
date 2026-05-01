import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CompanyService } from '../../../services/company.service';
import { CompanyResponse } from '../../../shared/models/responces/company-response';

@Component({
  selector: 'app-company-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './company-detail.html',
  styleUrl: './company-detail.css',
})
export class CompanyDetail {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private companyService = inject(CompanyService);

   company: CompanyResponse | null = null;
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.router.navigate(['/companies']);
      return;
    }

    this.companyService.getById(id).subscribe({
      next: (data) => {
        this.company = data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load company details.';
        this.isLoading = false;
      }
    });
  }
}
