import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isLoggedIn: boolean = false;
  isAdmin: boolean = false; // Nueva propiedad para verificar si es administrador

  constructor(
    private router: Router,
    private menu: MenuController
  ) {}

  ngOnInit() {
    this.checkSession(); // Verifica sesión al inicializar el componente
  }

  async closeMenu() {
    if (await this.menu.isOpen('main-menu')) {
      this.menu.close('main-menu');
    }
  }

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
    this.closeMenu();
  }

  cerrarSesion() {
    console.log('Cerrar sesión');
    localStorage.removeItem('tipo_usuario'); // Borra el tipo de usuario
    this.router.navigate(['/login']); // Redirige a la página de login
    this.closeMenu(); // Cierra el menú si está abierto
    this.isLoggedIn = false; // Actualiza el estado de sesión
    this.isAdmin = false; // Reinicia el estado de administrador
  }

  checkSession() {
    const tipoUsuario = localStorage.getItem('tipo_usuario');
    if (tipoUsuario) {
      this.isLoggedIn = true;
      this.checkUserType(); // Llama a la función para verificar si es administrador
    } else {
      this.isLoggedIn = false;
      this.isAdmin = false;
    }
  }

  private checkUserType(): void {
    const tipoUsuario = localStorage.getItem('tipo_usuario');
    this.isAdmin = tipoUsuario === 'admin'; // Asigna true si es admin, false de lo contrario
  }
}
