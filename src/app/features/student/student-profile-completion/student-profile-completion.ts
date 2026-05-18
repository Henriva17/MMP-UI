import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/AuthService';
import { Router } from '@angular/router';
import { EducationLevel } from '../../../shared/models/enums/educationLevel';
import { CreateStudentProfileRequest } from '../../../shared/models/requests/create-student-profile.request';

@Component({
  selector: 'app-student-profile-completion',
  imports: [FormsModule, CommonModule],
  templateUrl: './student-profile-completion.html',
  styleUrl: './student-profile-completion.css',
})
export class StudentProfileCompletion {
private userService = inject(UserService);
  private authService = inject(AuthService);
  private router = inject(Router);

  educationLevels = Object.values(EducationLevel);
  isLoading = false;
  errorMessage = '';
  skillInput = '';

  form: CreateStudentProfileRequest = {
    studentMat: '',
    bio: '',
    fieldOfStudy: '',
    educationLevel: EducationLevel.BACHELOR,
    graduationYear: new Date().getFullYear(),
    university: '',
    skills: [],
    githubLink: '',
    portfolioLink: '',
    cvFilePath: ''
  };

  addSkill(): void {
    const skill = this.skillInput.trim();
    if (skill && !this.form.skills.includes(skill)) {
      this.form.skills = [...this.form.skills, skill];
      this.skillInput = '';
    }
  }

  removeSkill(skill: string): void {
    this.form.skills = this.form.skills.filter(s => s !== skill);
  }

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const userId = this.authService.getUserId(); // 

    this.userService.createStudentProfile(userId, this.form).subscribe({
  next: (response: any) => {
console.log('PROFILE RESPONSE:', response);  // log check

    this.isLoading = false;

    // Clear old studentId first
    localStorage.removeItem('studentId');
    localStorage.removeItem('companyId');

    // Save new one
    if (response?.id) {
      localStorage.setItem('studentId', response.id.toString());
    }

    this.router.navigate(['/student-dashboard']);
  },
  error: (err) => {
    console.log('PROFILE ERROR:', err); //Log cehck
    this.isLoading = false;
    this.errorMessage = 'Failed to complete profile. Please try again.';
  }
});
  }
}


