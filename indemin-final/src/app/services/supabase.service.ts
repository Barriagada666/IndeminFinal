import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser } from '../models/IUser';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  constructor(private http: HttpClient) { }

  IUser(email: string, password: string): Observable<any> {
    const backendUrl = 'http://localhost:5000';
    const apiUrl = `${backendUrl}/usuario`;
    const params = {
      email,
      password
    };

    return this.http.get(apiUrl, { params });
  }
}