import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { CreateJobPostingRequest } from '../shared/models/requests/create-job-posting-request';
import { JobPostingResponse } from '../shared/models/responces/job-posting-response';



@Injectable({
  providedIn: 'root'
})
export class JobpostingService {

  private readonly baseUrl = environment.url + '/job-postings';

  constructor(private http: HttpClient) {}

  createPosting(
    companyId: number,
    request: CreateJobPostingRequest
  ): Observable<JobPostingResponse> {
    return this.http.post<JobPostingResponse>(
      `${this.baseUrl}/companies/${companyId}`,
      request
    );
  }

  getAllPostings(): Observable<JobPostingResponse[]> {
    return this.http.get<JobPostingResponse[]>(this.baseUrl);
  }

  getOpenPostings(): Observable<JobPostingResponse[]> {
    return this.http.get<JobPostingResponse[]>(`${this.baseUrl}/open`);
  }

  getById(id: number): Observable<JobPostingResponse> {
    return this.http.get<JobPostingResponse>(`${this.baseUrl}/${id}`);
  }

  getByCompany(companyId: number): Observable<JobPostingResponse[]> {
    return this.http.get<JobPostingResponse[]>(
      `${this.baseUrl}/companies/${companyId}`
    );
  }

  publish(id: number): Observable<JobPostingResponse> {
    return this.http.put<JobPostingResponse>(
      `${this.baseUrl}/${id}/publish`,
      {}
    );
  }

  close(id: number): Observable<JobPostingResponse> {
    return this.http.put<JobPostingResponse>(
      `${this.baseUrl}/${id}/close`,
      {}
    );
  }

  archive(id: number): Observable<JobPostingResponse> {
    return this.http.put<JobPostingResponse>(
      `${this.baseUrl}/${id}/archive`,
      {}
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}