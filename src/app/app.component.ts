import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MenuController, Platform, AlertController, ToastController } from '@ionic/angular';
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
  isLoginPage: boolean = false;
  userEmail: string = '';
  isDarkTheme: boolean = false; 
  

  constructor(
    private router: Router,
    private menu: MenuController,
    private platform: Platform,
    private location: Location,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isLoginPage = this.router.url === '/login';
        this.menu.enable(!this.isLoginPage, 'main-menu');
      }
    });
  }

  ngOnInit() {
    this.checkSession();
    this.initializeBackButtonCustomHandler();
    this.checkTheme();
  }

  initializeBackButtonCustomHandler(): void {
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (this.router.url === '/login' || !this.location.isCurrentPathEqualTo('/')) {
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
    localStorage.removeItem('userEmail');
    this.router.navigate(['/login']);
    this.closeMenu();
    this.isLoggedIn = false;
    this.isAdmin = false;
    this.userEmail = '';
  }

  checkSession() {
    const tipoUsuario = localStorage.getItem('tipo_usuario');
    const userEmail = localStorage.getItem('userEmail');
    if (tipoUsuario) {
      this.isLoggedIn = true;
      this.userEmail = userEmail || '';
      this.checkUserType();
    } else {
      this.isLoggedIn = false;
      this.isAdmin = false;
      this.userEmail = '';
    }
  }

  private checkUserType(): void {
    const tipoUsuario = localStorage.getItem('tipo_usuario');
    this.isAdmin = tipoUsuario === 'admin';
  }

  // Método para mostrar la alerta con el email
  async openProfileAlert() {
    const alert = await this.alertController.create({
      header: 'Perfil',
      message: `Email: ${this.userEmail}`,
      buttons: ['Cerrar']
    });

    await alert.present();
  }

  // Método para alternar el tema
  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    document.body.classList.toggle('dark', this.isDarkTheme);
    localStorage.setItem('isDarkTheme', this.isDarkTheme.toString());
  }

  // Método para comprobar el tema al iniciar
  checkTheme() {
    const storedTheme = localStorage.getItem('isDarkTheme') === 'true';
    this.isDarkTheme = storedTheme;
    document.body.classList.toggle('dark', this.isDarkTheme);
  }

  // Método para mostrar la alerta de configuración
  async openSettingsAlert() {
    const alert = await this.alertController.create({
      header: 'Configuración',
      buttons: [
        {
          text: this.isDarkTheme ? 'Cambiar a Tema Claro' : 'Cambiar a Tema Oscuro',
          handler: () => {
            this.toggleTheme();
          }
        },
        {
          text: 'Cerrar',
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }

  // Método para mostrar la alerta de "Acerca de"
  async openAboutAlert() {
    const alert = await this.alertController.create({
      header: 'Acerca de',
      message: `Esta aplicación ha sido desarrollada por Estudiantes de DUOC para gestionar checklists de mantenimiento rutinario para empresa Indemin , ver2.3.`,
      buttons: ['Cerrar']
    });

    await alert.present();
  }
}
