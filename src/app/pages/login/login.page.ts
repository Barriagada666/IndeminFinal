import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { SupabaseService } from 'src/app/services/supabase.service';
import { userLogin } from 'src/app/models/userLogin';
import { AppComponent } from 'src/app/app.component';
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


  constructor(
    private router: Router,
    private supabaseService: SupabaseService,
    private toastController: ToastController,
    private appComponent: AppComponent,
    private loadingCtrl: LoadingController,
    private menu: MenuController
  ) {}

  ngOnInit() {
    // Desactivar el menú deslizante en la página de inicio de sesión
    this.menu.enable(false);
  }

  async login() {
    await this.LoadingBoton(); // Mostrar carga al iniciar sesión

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
      let errorMessage = 'Ocurrió un error en la autenticación. Por favor, inténtelo de nuevo.';

      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error && typeof error === 'object' && error.hasOwnProperty('error')) {
        errorMessage = error.toString();
      }

      this.presentToast(errorMessage);
    } finally 
    {
      await this.dismissLoading(); // Ocultar carga al finalizar inicio de sesión
      this.appComponent.checkSession();
    }
  }

  async LoadingBoton() {
    const loading = await this.loadingCtrl.create({
      message: 'Iniciando sesión...'
    });
    await loading.present();
  }

  async dismissLoading() {
    await this.loadingCtrl.dismiss();
  }

  handleSuccessfulLogin(usuario: any) {
    console.log('Usuario logueado:', usuario);
    this.dismissLoading(); // Asegúrate de ocultar la carga al finalizar correctamente
    this.menu.enable(true);
    const userType = usuario.tipo_usuario;

    if (userType === 'admin') {
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

  ngOnDestroy() {
    this.menu.enable(true); // Habilitar el menú deslizante al destruir el componente
    // Puede realizar limpieza adicional aquí si es necesario al destruir el componente
  }
}
