import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/AuthService';
import { Router } from '@angular/router';
import { CreateCompanyProfileRequest } from '../../../shared/models/requests/create-company-profile-request';

@Component({
  selector: 'app-company-profile-completion',
  standalone:true,
  imports: [FormsModule, CommonModule],
  templateUrl: './company-profile-completion.html',
  styleUrl: './company-profile-completion.css',
})
export class CompanyProfileCompletion {
 private userService = inject(UserService);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = false;
  errorMessage = '';

  form: CreateCompanyProfileRequest = {
    description: '',
    domainOfActivity: '',
    websiteLink: '',
    companySize: 0
  };

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const userId = this.authService.getUserId();

    this.userService.createCompanyProfile(userId, this.form).subscribe({
  next: (response: any) => {

  console.log('COMPANY PROFILE RESPONSE:', response);

  this.isLoading = false;

  localStorage.setItem('token', response.token);
  localStorage.setItem('role', response.role);
  localStorage.setItem('userId', response.userId.toString());

  localStorage.removeItem('studentId');

  if (response.companyId) {
    localStorage.setItem('companyId', response.companyId.toString());
  }

  this.router.navigate(['/company/company-dashboard']);
},
  error: () => {
    this.isLoading = false;
    this.errorMessage = 'Failed to complete profile. Please try again.';
  }
});
  }
}
