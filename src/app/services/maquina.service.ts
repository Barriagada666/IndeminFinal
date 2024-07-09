import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Maquina } from '../models/Maquina';
import { Checklist } from '../models/Checklist';

@Injectable({
  providedIn: 'root'
})
export class MaquinaService {
  private baseUrl = 'https://backend-indemin.onrender.com/api'; // Base URL de tu backend

  supebaseheads = new HttpHeaders()
  .set('apikey', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxjc2VybGl3dXF3emZqdHJkY2liIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU2MjU3MjYsImV4cCI6MjAzMTIwMTcyNn0.h81cjxbMg7kWQ2Wv-YP3augY5_071Bpjfl57_jCXThQ');


  constructor(private http: HttpClient) { }

  getMachines(codigoInterno: string): Observable<Maquina[]> {
    return this.http.get<Maquina[]>(`${this.baseUrl}/maquinas?codigo_interno=${codigoInterno}`, { headers: this.supebaseheads })
      .pipe(
        catchError(this.handleError)
      );
  }
  getChecklistByCodigoInterno(codigoInterno: string): Observable<Checklist[]> {
    return this.http.get<Checklist[]>(`${this.baseUrl}/checklists?codigo_interno=${codigoInterno}`, { headers: this.supebaseheads }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }
}