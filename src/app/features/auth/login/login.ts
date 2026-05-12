import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/AuthService';
import { Role } from '../../../shared/models/enums/role';
import { Footer } from '../../../shared/footer/footer';
import { Navbar } from '../../../shared/navbar/navbar';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, Footer, Navbar],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;
constructor(
  private authService: AuthService,
  private router: Router
) {}

onSubmit(): void {
  this.isLoading = true;
    this.errorMessage = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        //  role based redirect after login
        if (response.role === Role.USER) {
          this.router.navigate(['/choose-role']);
        } else if (response.role === Role.STUDENT) {
          this.router.navigate(['/student-dashboard']);
        } else if (response.role === Role.COMPANY) {
          this.router.navigate(['/company-dashboard']);
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Invalid email or password.';
      }
    });
  }
}