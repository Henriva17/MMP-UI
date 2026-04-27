import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { CreateCompanyProfileRequest } from '../shared/models/requests/create-company-profile-request';
import { CompanyResponse } from '../shared/models/responces/company-response';



@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private readonly baseUrl = environment.url + '/companies';

  constructor(private http: HttpClient) {}

  createProfile(
    userId: number,
    request: CreateCompanyProfileRequest
  ): Observable<CompanyResponse> {
    return this.http.post<CompanyResponse>(
      `${this.baseUrl}/users/${userId}`,
      request
    );
  }

  getById(id: number): Observable<CompanyResponse> {
    return this.http.get<CompanyResponse>(`${this.baseUrl}/${id}`);
  }

 getAllCompanies(): Observable<CompanyResponse[]> {
  console.log('Calling API:', this.baseUrl);
  return this.http.get<CompanyResponse[]>(this.baseUrl);
}

  getVerifiedCompanies(): Observable<CompanyResponse[]> {
    return this.http.get<CompanyResponse[]>(`${this.baseUrl}/verified`);
  }

  getByDomain(domain: string): Observable<CompanyResponse[]> {
    return this.http.get<CompanyResponse[]>(
      `${this.baseUrl}/domain/${domain}`
    );
  }

  verifyCompany(id: number): Observable<CompanyResponse> {
    return this.http.patch<CompanyResponse>(
      `${this.baseUrl}/${id}/verify`,
      {}
    );
  }

  updateDescription(
    id: number,
    description: string
  ): Observable<CompanyResponse> {
    return this.http.patch<CompanyResponse>(
      `${this.baseUrl}/${id}/description`,
      { description }
    );
  }

  updateWebsiteLink(
    id: number,
    websiteLink: string
  ): Observable<CompanyResponse> {
    return this.http.patch<CompanyResponse>(
      `${this.baseUrl}/${id}/website-link`,
      { websiteLink }
    );
  }

  deleteProfile(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}