import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { SupabaseService } from 'src/app/services/supabase.service';
import { userLogin } from 'src/app/models/userLogin';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  userLogin: userLogin = {
    email: '',
    password: '',
    tipo_usuario: ''
  };

  rememberMe: boolean = false;

  constructor(
    private router: Router,
    private supabaseService: SupabaseService,
    private toastController: ToastController,
    private loadingCtrl: LoadingController,
    private menu: MenuController
  ) {}

  ngOnInit() {
    // Desactivar el menú deslizante en la página de inicio de sesión
    this.menu.enable(false);
  }

  async login() {
    const loading = await this.loadingCtrl.create({
      message: 'Iniciando sesión...'
    });
    await loading.present();

    try {
      const response = await this.supabaseService.login(this.userLogin).toPromise();
      if (response && response.user) {
        const usuario = response.user;
        localStorage.setItem('tipo_usuario', usuario.tipo_usuario);
        localStorage.setItem('userId', usuario.id_usuario.toString());
        this.handleSuccessfulLogin(usuario);
      } else {
        this.presentToast('Usuario y/o Contraseña incorrectas');
      }
    } catch (error) {
      console.error('Error en la autenticación:', error);
      this.presentToast('Ocurrió un error en la autenticación. Por favor, inténtelo de nuevo.');
    } finally {
      await loading.dismiss();
    }
  }

  handleSuccessfulLogin(usuario: any) {
    if (usuario.tipo_usuario === 'admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/home']);
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  navigateToResetPassword() {
    this.router.navigate(['/reset-password']);
  }

  ngOnDestroy() {
    this.menu.enable(true); // Habilitar el menú deslizante al destruir el componente
  }
}
