import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';

  errorMessage = '';
  successMessage = '';

  constructor(private userService: UserService, private router: Router) {}

  onSubmit(): void {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    const request = {
      fullName: this.fullName,
      email: this.email,
      password: this.password
    };

    this.userService.register(request).subscribe({
      next: (response) => {
        console.log('User created:', response);
        this.router.navigate(['/login']);
        this.errorMessage = '';
      },
      error: (err) => {
        console.error('Error:', err);
        this.errorMessage = 'Registration failed.';
      }
    });
  }
}