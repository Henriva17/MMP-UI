import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/AuthService';
import { Role } from '../../shared/models/enums/role';

@Component({
  selector: 'app-choose-role',
  imports: [CommonModule, RouterLink],
  templateUrl: './choose-role.html',
  styleUrl: './choose-role.css',
})
export class ChooseRole {
  private router = inject(Router);
  private authService = inject(AuthService);
  chooseStudent(): void {
    localStorage.setItem('role', Role.STUDENT);       // update role
    this.router.navigate(['/student/complete-profile']);
  }

  chooseCompany(): void {
    localStorage.setItem('role', Role.COMPANY);
    this.router.navigate(['/company/complete-profile']);
  }
}
