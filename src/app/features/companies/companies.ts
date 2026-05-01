import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CompanyResponse } from '../../shared/models/responces/company-response';
import { CompanyService } from '../../services/company.service';


@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './companies.html',
  styleUrl: './companies.css',
})
export class Companies implements OnInit {
  searchTerm = '';
  selectedDomain = '';

  companies: CompanyResponse[] = [];
  errorMessage = '';

  constructor(
    private companyService: CompanyService) {}

  ngOnInit(): void {
    console.log('Companies component loaded');
    this.loadCompanies();
    
  }

  loadCompanies(): void {

    this.companyService.getAllCompanies().subscribe({
      next: (data) => {
        console.log('Companies from API:', data);
        this.companies = data;
        
      },
      error: (error) => {
        console.error('API error:', error);
        this.errorMessage = 'Failed to load companies';
        
      }
    });
  }

  get domains(): string[] {
    return [...new Set(this.companies.map(c => c.domainOfActivity))];
  }

  filteredCompanies(): CompanyResponse[] {
    return this.companies.filter(company => {
      const matchesSearch = company.fullName
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase());

      const matchesDomain =
        !this.selectedDomain ||
        company.domainOfActivity === this.selectedDomain;

      return matchesSearch && matchesDomain;
    });
  }

  getVerifiedCount(): number {
    return this.companies.filter(c => c.verificationStatus === 'VERIFIED').length;
  }

  getPendingCount(): number {
    return this.companies.filter(c => c.verificationStatus === 'PENDING').length;
  }
}