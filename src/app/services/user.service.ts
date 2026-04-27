import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { RegisterUserRequest } from '../shared/models/requests/register-user-request';
import { Role } from '../shared/models/enums/role';
import { Status } from '../shared/models/enums/status';
import { UserResponse } from '../shared/models/responces/user-response';



@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
    private baseUrl: string = environment.url + "/users"

     // POST /api/users/register
      register(request: RegisterUserRequest): Observable<UserResponse> {
        return this.http.post<UserResponse>(`${this.baseUrl}/register`, request);
      }

      // GET /api/users
      getAllUsers(): Observable<UserResponse[]> {
        return this.http.get<UserResponse[]>(this.baseUrl);
      }

      // GET /api/users/:id
      getUserById(id: number): Observable<UserResponse> {
        return this.http.get<UserResponse>(`${this.baseUrl}/${id}`);
      }

      // GET /api/users/role/:role
      getUsersByRole(role: Role): Observable<UserResponse[]> {
        return this.http.get<UserResponse[]>(`${this.baseUrl}/role/${role}`);
      }

      // PUT /api/users/:id/status?status=STATUS
      updateStatus(id: number, status: Status): Observable<UserResponse> {
        const params = new HttpParams().set('status', status);
        return this.http.put<UserResponse>(`${this.baseUrl}/${id}/status`, null, { params });
      }
      // DELETE /api/users/:id
      deactivateUser(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
