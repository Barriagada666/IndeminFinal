import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { userLogin } from '../models/userLogin';


@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  supabase_url = 'https://lcserliwuqwzfjtrdcib.supabase.co/rest/v1/'

  constructor(private http: HttpClient) { }

  private baseUrl = 'http://localhost:5000/api'
  
  supebaseheads = new HttpHeaders()
  .set ('apikey', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxjc2VybGl3dXF3emZqdHJkY2liIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU2MjU3MjYsImV4cCI6MjAzMTIwMTcyNn0.h81cjxbMg7kWQ2Wv-YP3augY5_071Bpjfl57_jCXThQ');

  getLogin(userLogin: userLogin): Observable<any> {
    const credentials = { email: userLogin.email, password: userLogin.password };
    return this.http.post<any>(`${this.baseUrl}/usuario`, credentials)
      .pipe(
        catchError(this.handleError)
      );
  }
  handleError(error: any): Observable<any> {
    console.error('An error occurred:', error);
    throw error;
  }
  }