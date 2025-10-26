import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterUser, User } from '../../users/user.model';
import { AppSettings } from '../../app.config';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly base = `${AppSettings.apiBaseUrl}${AppSettings.usersUrl}`;

  constructor(private readonly http: HttpClient) {}

  listAll(): Observable<User[]> {
    return this.http.get<User[]>(this.base);
  }

  getById(id: string): Observable<User> {
    return this.http.get<User>(`${this.base}/${id}`);
  }

  create(user: RegisterUser): Observable<User> {
    return this.http.post<User>(this.base, user);
  }

  createAdmin(user: RegisterUser): Observable<User> {
    return this.http.post<User>(`${this.base}/admin`, user);
  }

  update(id: string, user: RegisterUser): Observable<User> {
    return this.http.put<User>(`${this.base}/${id}`, user);
  }

  // delete(id?: string): Observable<void> {
  //   if (!id) throw new Error('User ID is required');
  //   return this.http.delete<void>(`${this.base}/${id}`);
  // }
}
