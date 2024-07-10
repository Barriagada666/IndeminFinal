import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Checklist } from '../models/Checklist';

@Injectable({
  providedIn: 'root'
})
export class ChecklistService {
  private baseUrl = 'https://backend-indemin-q64w.onrender.com/api';  

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
    const dataToSend = {
      nombre: updatedChecklist.nombre,
      id_tipo_maquina: updatedChecklist.id_tipo_maquina,
      componentes: updatedChecklist.componentes.map(comp => ({
        id_componente: comp.id_componente,
        nombre: comp.nombre,
        tasks: comp.tasks.map(task => ({
          id_tarea: task.id_tarea,
          nombre: task.nombre
        }))
      }))
    };
  
    return this.http.patch<any>(`${this.baseUrl}/edit_checklist/${id}`, dataToSend, { headers: this.supabaseHeaders }).pipe(
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

  getMachineTypes(): Observable<{ id: number, name: string }[]> {
    return this.http.get<{ id: number, name: string }[]>(`${this.baseUrl}/machine-types`, { headers: this.supabaseHeaders }).pipe(
      catchError(this.handleError)
    );
  }

  getMaquinasByCodigoInterno(codigoInterno: string): Observable<any[]> {  
    return this.http.get<any[]>(`${this.baseUrl}/maquinas?codigo_interno=${codigoInterno}`, { headers: this.supabaseHeaders }).pipe(
      catchError(this.handleError)
    );
  }

  getStatus(): Observable<any[]> {
    const url = `${this.baseUrl}/status`;
    console.log('URL de solicitud:', url);
    console.log('Cabeceras:', this.supabaseHeaders);
  
    return this.http.get<any[]>(url, { headers: this.supabaseHeaders }).pipe(
      catchError(this.handleError)
    );
  }


  saveTaskComment(taskId: number, comment: string): Observable<any> {
    const url = `${this.baseUrl}/save_task_comment/${taskId}`;
    return this.http.patch<any>(url, { comment: comment });
  }

  private handleError(error: any): Observable<any> {
    console.error('An error occurred:', error);
    return throwError(error);
  }
}
