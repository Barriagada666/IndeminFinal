import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUserLogin } from '../models/IUserLogin';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private baseUrl = 'https://backend-indemin-q64w.onrender.com'; // URL de tu backend

  constructor(private http: HttpClient) { }

  authenticateUser(userLogin: IUserLogin): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/authenticate?email=${userLogin.email}&password=${userLogin.password}`);
  }
}
