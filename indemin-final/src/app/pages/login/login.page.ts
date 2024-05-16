import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';




@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  UserLogin = { 
    email: '', 
    password: '' 
  };

  isLoaded = false;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    setTimeout(() => {
      this.isLoaded = true;
    }, 800);
  }

  getLogin(UserLogin: any): Observable<any> {
    const credencial = { email: UserLogin.email, password: UserLogin.password };
    return this.http.post('http://localhost:5000'+'/login', credencial).pipe(
      catchError(this.handleError) 
  );
  }
  handleError(error: any): Observable<any> {
    console.error('An error occurred:', error);
    throw error;
  }
}