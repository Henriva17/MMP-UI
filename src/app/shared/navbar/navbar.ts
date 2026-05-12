import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/AuthService';
import { Role } from '../models/enums/role';

@Component({
  selector: 'app-navbar',
  standalone:true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit{
  isLoggedIn = false;
  fullName: string | null = null;
  role: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.fullName = this.authService.getFullName();
    this.role = this.authService.getRole();
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
  }

  getProfileRoute(): string {
  if (this.role === Role.STUDENT) {
    return '/student/student-dashboard';
  } else if (this.role === Role.COMPANY) {
    return '/company/company-dashboard';
  }else {
    return '/home';
  }
}
}
