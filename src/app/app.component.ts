import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, Platform } from '@ionic/angular';
import { Location } from '@angular/common';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;

  constructor(
    private router: Router,
    private menu: MenuController,
    private platform: Platform,
    private location: Location
  ) {}

  ngOnInit() {
    this.checkSession();
  }

  initializeBackButtonCustomHandler(): void {
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (
        this.router.url === '/login' ||
        !this.location.isCurrentPathEqualTo('/')
      ) {
        App.exitApp();
        this.cerrarSesion();
      } else {
        this.location.back();
      }
    });
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
    localStorage.removeItem('tipo_usuario');
    localStorage.removeItem('userId');
    this.router.navigate(['/login']);
    this.closeMenu();
    this.isLoggedIn = false;
    this.isAdmin = false;
  }

  checkSession() {
    const tipoUsuario = localStorage.getItem('tipo_usuario');
    if (tipoUsuario) {
      this.isLoggedIn = true;
      this.checkUserType();
    } else {
      this.isLoggedIn = false;
      this.isAdmin = false;
    }
  }

  private checkUserType(): void {
    const tipoUsuario = localStorage.getItem('tipo_usuario');
    this.isAdmin = tipoUsuario === 'admin';
  }
}
