import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChecklistRealizado } from '../models/Checklist';

@Injectable({
  providedIn: 'root'
})
export class ChecklistRealizadoService {
  private baseUrl = 'https://backend-indemin.onrender.com/api'; // Cambia esta URL por la URL de tu backend

  constructor(private http: HttpClient) { }

  guardarChecklist(checklistRealizado: ChecklistRealizado): Observable<any> {
    const url = `${this.baseUrl}/checklist_realizado`; // Endpoint para guardar el checklist realizado en el backend
    return this.http.post(url, checklistRealizado);
  }
}
