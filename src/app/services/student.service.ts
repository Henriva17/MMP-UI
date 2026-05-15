import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { StudentResponse } from '../shared/models/responces/student-responce';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
 private readonly baseUrl = environment.url + '/students';


  constructor(private http: HttpClient) {}

 

  getStudentById(studentId: number): Observable<StudentResponse> {
    return this.http.get<StudentResponse>(`${this.baseUrl}/${studentId}`);
  }

  updateStudent(studentId: number, data: Partial<StudentResponse>): Observable<StudentResponse> {
    return this.http.put<StudentResponse>(`${this.baseUrl}/${studentId}`, data);
  }

  updateBio(studentId: number, bio: string): Observable<StudentResponse> {
  return this.http.put<StudentResponse>(
    `${this.baseUrl}/${studentId}/bio`, null, { params: { bio } }
  );
}

updateSkills(studentId: number, skills: string[]): Observable<StudentResponse> {
  return this.http.put<StudentResponse>(
    `${this.baseUrl}/${studentId}/skills`, skills
  );
}
}