import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Footer } from '../../../shared/footer/footer';
import { Navbar } from '../../../shared/navbar/navbar';
import { StudentService } from '../../../services/student.service';
import { AuthService } from '../../../services/AuthService';
import { StudentResponse } from '../../../shared/models/responces/student-responce';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-profile',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink, Footer, Navbar],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css',
})
export class EditProfile implements OnInit {
  private studentService = inject(StudentService);
  private authService = inject(AuthService);
  private router = inject(Router);

  private studentId = this.authService.getStudentId();

  student: StudentResponse | null = null;
  isLoading = true;
  isSaving = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  // bio form
  bioForm = new FormGroup({
    bio: new FormControl('', [Validators.maxLength(500)])
  });

  // skills
  skills: string[] = [];
  newSkill = '';

  ngOnInit(): void {
    this.studentService.getStudentById(this.studentId).subscribe({
      next: (data) => {
        this.student = data;
        this.bioForm.patchValue({ bio: data.bio });
        this.skills = [...data.skills];
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  saveBio(): void {
    if (this.bioForm.invalid || this.isSaving) return;
    this.isSaving = true;
    const bio = this.bioForm.value.bio ?? '';

    this.studentService.updateBio(this.studentId, bio).subscribe({
      next: () => {
        this.successMessage = 'Bio updated successfully.';
        this.isSaving = false;
      },
      error: () => {
        this.errorMessage = 'Failed to update bio.';
        this.isSaving = false;
      }
    });
  }

  addSkill(): void {
    const trimmed = this.newSkill.trim();
    if (trimmed && !this.skills.includes(trimmed)) {
      this.skills = [...this.skills, trimmed];
      this.newSkill = '';
    }
  }

  removeSkill(skill: string): void {
    this.skills = this.skills.filter(s => s !== skill);
  }

  saveSkills(): void {
    if (this.isSaving) return;
    this.isSaving = true;

    this.studentService.updateSkills(this.studentId, this.skills).subscribe({
      next: () => {
        this.successMessage = 'Skills updated successfully.';
        this.isSaving = false;
      },
      error: () => {
        this.errorMessage = 'Failed to update skills.';
        this.isSaving = false;
      }
    });
  }

  goBack(): void {
  this.router.navigate(['/student/student-dashboard']);
}
}
