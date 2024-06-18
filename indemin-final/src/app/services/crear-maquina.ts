// src/app/services/crear-maquina.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Maquina } from '../models/Maquina'; // Asegúrate de importar el modelo correcto

@Injectable({
  providedIn: 'root'
})
export class CrearMaquinaService {

  private baseUrl = 'http://localhost:5000/api'; // Base URL de tu backend
  supabaseHeaders = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('apikey', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxjc2VybGl3dXF3emZqdHJkY2liIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU2MjU3MjYsImV4cCI6MjAzMTIwMTcyNn0.h81cjxbMg7kWQ2Wv-YP3augY5_071Bpjfl57_jCXThQ');

  constructor(private http: HttpClient) {}

  crearMaquina(maquinas: Maquina): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/crear_maquinas`, maquinas, { headers: this.supabaseHeaders })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }
}
