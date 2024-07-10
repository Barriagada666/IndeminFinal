import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RealizarChecklistRequest } from '../models/Checklist';

@Injectable({
  providedIn: 'root'
})
export class ChecklistRealizadoService {
  private baseUrl = 'https://backend-indemin-q64w.onrender.com/api'; // Cambia esta URL por la URL de tu backend

  supabaseHeaders = new HttpHeaders()
  .set('Content-Type', 'application/json')
  .set('apikey', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxjc2VybGl3dXF3emZqdHJkY2liIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU2MjU3MjYsImV4cCI6MjAzMTIwMTcyNn0.h81cjxbMg7kWQ2Wv-YP3augY5_071Bpjfl57_jCXThQ');

  
  constructor(private http: HttpClient) { }

  guardarChecklist(checklistRealizado: RealizarChecklistRequest): Observable<any> {
    const token = localStorage.getItem('authToken'); // Obtén el token del localStorage
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Agrega el token al encabezado de autorización
    });

    console.log('Enviando checklist:', checklistRealizado); // Debug: Mostrar los datos que se envían
    console.log('Encabezados de la solicitud:', headers); // Debug: Mostrar los encabezados de la solicitud

    return this.http.post<any>(`${this.baseUrl}/realizar_checklist`, checklistRealizado, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  updateTaskStatus(taskId: number, newStatus: string): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/update_task_status/${taskId}`, { status: newStatus }, { headers: this.supabaseHeaders }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Ocurrió un error al intentar guardar el checklist. Por favor, inténtelo de nuevo más tarde.');
  }
}
