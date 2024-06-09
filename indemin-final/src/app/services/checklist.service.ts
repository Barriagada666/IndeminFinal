import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Checklist } from '../models/Checklist';

@Injectable({
  providedIn: 'root'
})
export class ChecklistService {
  private baseUrl = 'http://localhost:5000/api';  

  supabaseHeaders = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('apikey', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxjc2VybGl3dXF3emZqdHJkY2liIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU2MjU3MjYsImV4cCI6MjAzMTIwMTcyNn0.h81cjxbMg7kWQ2Wv-YP3augY5_071Bpjfl57_jCXThQ');

  constructor(private http: HttpClient) { }

  createChecklist(checklist: Checklist): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/create_checklist`, checklist, { headers: this.supabaseHeaders }).pipe(
      catchError(this.handleError)
    );
  }

  updateChecklist(id: number, checklist: Checklist): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/update_checklist/${id}`, checklist, { headers: this.supabaseHeaders }).pipe(
      catchError(this.handleError)
    );
  }

  editChecklist(id: number, updatedChecklist: Checklist): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/edit_checklist/${id}`, updatedChecklist, { headers: this.supabaseHeaders }).pipe(
      catchError(this.handleError)
    );
  }

  getChecklistById(id: number): Observable<Checklist> {
    return this.http.get<Checklist>(`${this.baseUrl}/checklist/${id}`, { headers: this.supabaseHeaders }).pipe(
      catchError(this.handleError)
    );
  }

  getChecklistByCodigoInterno(codigoInterno: string): Observable<Checklist[]> {
    return this.http.get<Checklist[]>(`${this.baseUrl}/checklists?codigo_interno=${codigoInterno}`, { headers: this.supabaseHeaders }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<any> {
    console.error('An error occurred:', error);
    return throwError(error);
  }
}
