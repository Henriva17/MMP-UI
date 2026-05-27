import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/AuthService';
import { Router } from '@angular/router';
import { EducationLevel } from '../../../shared/models/enums/educationLevel';
import { CreateStudentProfileRequest } from '../../../shared/models/requests/create-student-profile.request';
import { Role } from '../../../shared/models/enums/role';

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

     localStorage.setItem('token', response.token);
  localStorage.setItem('role', response.role);
  localStorage.setItem('userId', response.userId.toString());
  localStorage.setItem('studentId', response.studentId.toString());
  console.log('PROFILE RESPONSE:', response);  // log check

    this.isLoading = false;

    // Clear old studentId first
    localStorage.removeItem('studentId');
    localStorage.removeItem('companyId');

    // Save new one
   const studentId = response?.id ?? response?.studentId ?? userId;

  if (!studentId) {
    this.errorMessage = 'Student profile created, but student ID was not returned.';
    return;
  }

  localStorage.setItem('studentId', studentId.toString());
  localStorage.setItem('role', Role.STUDENT);

    this.router.navigate(['/student/dashboard']); // changed
  },
  error: (err) => {
    console.log('PROFILE ERROR:', err); //Log cehck
    this.isLoading = false;
    this.errorMessage = 'Failed to complete profile. Please try again.';
  }
});
  }
}


