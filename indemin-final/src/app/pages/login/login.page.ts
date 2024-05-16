import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUser} from 'src/app/models/IUser';
import { SupabaseService } from 'src/app/services/supabase.service';




@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  userLogin = { 
    email: '', 
    password: '' 
  };

  isLoaded = false;

  constructor(private router: Router, private supabaseService: SupabaseService) { }

  ngOnInit() {
    setTimeout(() => {
      this.isLoaded = true;
    }, 800);
  }

  onSubmit(): void {
    // Hacer la solicitud para obtener los datos del usuario
    this.supabaseService.IUser(this.userLogin.email, this.userLogin.password).subscribe(
      (userLogin: IUser) => {
        // Comparar las credenciales
        if (userLogin && userLogin.password === this.userLogin.password) {
          // Credenciales válidas, redirigir al usuario a la página de inicio
          this.router.navigate(['/home']);
        } else {
          // Credenciales incorrectas, mostrar un mensaje de error
          console.log('Credenciales incorrectas');
        }
      },
      (error) => {
        // Manejar el error en caso de fallo en la solicitud
        console.error('Error al obtener los datos del usuario:', error);
      }
    );
  }
}