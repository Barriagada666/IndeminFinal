import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss'],
})
export class NavMenuComponent implements OnInit {

  constructor(
    private router: Router,
    private menuController: MenuController
  ) { }

  ngOnInit() {
    // No necesitamos inicializar nada en particular en este método por ahora
  }



  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
    this.closeMenu();
  }

cerrarSesion() {
  console.log('Cerrar sesión');
  localStorage.removeItem('tipo_usuario'); // Borra solo el tipo de usuario
  this.router.navigate(['/login']); // Redirige a la página de login
  this.closeMenu(); // Cierra el menú si está abierto
}


  private async closeMenu() {
    await this.menuController.close(); // Cerrar el menú lateral
  }

}
