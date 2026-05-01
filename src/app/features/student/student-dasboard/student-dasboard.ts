import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/AuthService';

@Component({
  selector: 'app-student-dasboard',
  standalone:true,
  imports: [CommonModule, RouterLink],
  templateUrl: './student-dasboard.html',
  styleUrl: './student-dasboard.css',
})
export class StudentDasboard implements OnInit{
  private authService = inject(AuthService)

  fullName = '';
  ngOnInit(): void {
    this.fullName = this.authService.getFullName() ?? 'Student'
  }
}
