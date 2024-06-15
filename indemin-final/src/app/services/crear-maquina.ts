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
  private supabaseHeaders = new HttpHeaders()
    .set('apikey', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxjc2VybGl3dXF3emZqdHJkY2liIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU2MjU3MjYsImV4cCI6MjAzMTIwMTcyNn0.h81cjxbMg7kWQ2Wv-YP3augY5_071Bpjfl57_jCXThQ'); // Asegúrate de incluir tu API Key aquí

  constructor(private http: HttpClient) {}

  getMachines(): Observable<Maquina[]> {
    return this.http.get<Maquina[]>(`${this.baseUrl}/maquinas`, { headers: this.supabaseHeaders })
      .pipe(
        catchError(this.handleError)
      );
  }

  crearMaquina(maquina: Maquina): Observable<any> {
    return this.http.post(`${this.baseUrl}/maquinas`, maquina, { headers: this.supabaseHeaders })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }
}
