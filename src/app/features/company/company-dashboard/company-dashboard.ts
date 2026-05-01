import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/AuthService';

@Component({
  selector: 'app-company-dashboard',
  standalone:true,
  imports: [CommonModule, RouterLink],
  templateUrl: './company-dashboard.html',
  styleUrl: './company-dashboard.css',
})
export class CompanyDashboard  implements OnInit{

  private authServie = inject(AuthService);

  fullName =  '';

  ngOnInit(): void {
    this.fullName = this.authServie.getFullName() ?? 'Company';
  }
}
