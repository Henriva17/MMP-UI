import { Injectable } from "@angular/core";
import { environment } from '../../environments/environment';
import { HttpClient } from "@angular/common/http";
import { ApplyToJobRequest } from "../shared/models/requests/job-application-request";
import { JobApplicationResponse } from "../shared/models/responces/job-application-response";
import { Observable } from "rxjs";
import { JobApplicationStatus } from "../shared/models/enums/applicationStatus";

@Injectable({ providedIn: 'root' })
export class JobApplicationService {

  private readonly baseUrl = environment.url + '/job-applications';

  constructor(private http: HttpClient) {}

  apply(studentId: number, request: ApplyToJobRequest): Observable<JobApplicationResponse> {
    return this.http.post<JobApplicationResponse>(
      `${this.baseUrl}/students/${studentId}`, request
    );
  }

  getByStudent(studentId: number): Observable<JobApplicationResponse[]> {
    return this.http.get<JobApplicationResponse[]>(
      `${this.baseUrl}/students/${studentId}`
    );
  }

  getByJobPosting(jobPostingId: number): Observable<JobApplicationResponse[]> {
    return this.http.get<JobApplicationResponse[]>(
      `${this.baseUrl}/posting/${jobPostingId}`
    );
  }

  withdraw(id: number): Observable<JobApplicationResponse> {
    return this.http.patch<JobApplicationResponse>(
      `${this.baseUrl}/${id}/withdraw`, {}
    );
  }

  getByCompany(companyId: number): Observable<JobApplicationResponse[]> {
  return this.http.get<JobApplicationResponse[]>(
    `${this.baseUrl}/companies/${companyId}`
  );
}


review(id: number): Observable<JobApplicationResponse> {
  return this.http.put<JobApplicationResponse>(
    `${this.baseUrl}/${id}/review`, {}
  );
}

accept(id: number): Observable<JobApplicationResponse> {
  return this.http.put<JobApplicationResponse>(
    `${this.baseUrl}/${id}/accept`, {}
  );
}

reject(id: number): Observable<JobApplicationResponse> {
  return this.http.put<JobApplicationResponse>(
    `${this.baseUrl}/${id}/reject`, {}
  );
}

}