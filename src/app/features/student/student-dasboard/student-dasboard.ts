import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/AuthService';
import { Footer } from '../../../shared/footer/footer';
import { Navbar } from '../../../shared/navbar/navbar';
import { StudentResponse } from '../../../shared/models/responces/student-responce';
import { StudentService } from '../../../services/student.service';
import { JobApplicationResponse } from '../../../shared/models/responces/job-application-response';
import { JobApplicationService } from '../../../services/job-application.service';

@Component({
  selector: 'app-student-dasboard',
  standalone:true,
  imports: [CommonModule, RouterLink, Footer, Navbar],
  templateUrl: './student-dasboard.html',
  styleUrl: './student-dasboard.css',
})



export class StudentDasboard implements OnInit {
  student: StudentResponse | null = null;
  activeTab: 'profile' | 'jobs' | 'applications' = 'profile';
  isLoading = true;
  applications: JobApplicationResponse[] = [];
  isLoadingApplications = false;


private authService = inject(AuthService);
private studentService = inject(StudentService);
private applicationService = inject(JobApplicationService);
private route = inject(ActivatedRoute);

private studentId = this.authService.getStudentId();

   



ngOnInit(): void {
  // read tab from query param
  const tab = this.route.snapshot.queryParamMap.get('tab') as 'profile' | 'applications';
  if (tab) {
    this.onTabChange(tab);
  }

  this.studentService.getStudentById(this.studentId).subscribe({
    next: (data) => {
      this.student = data;
      this.isLoading = false;
    },
    error: () => this.isLoading = false
  });
}

  loadApplications(): void {
    this.isLoadingApplications = true;
    this.applicationService.getByStudent(this.studentId).subscribe({
      next: (data) => {
        this.applications = data;
        this.isLoadingApplications = false;
      },
      error: () => {
        this.isLoadingApplications = false;
      }
    });
  }

  onTabChange(tab: 'profile' | 'jobs' | 'applications'): void {
    this.activeTab = tab;
    if (tab === 'applications' && this.applications.length === 0) {
      this.loadApplications();
    }
  }

  setTab(tab: 'profile' | 'jobs' | 'applications'): void {
    this.activeTab = tab;
  }
}