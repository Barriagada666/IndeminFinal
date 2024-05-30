import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { SupabaseService } from 'src/app/services/supabase.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { userLogin } from 'src/app/models/userLogin';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';





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

  constructor(private router:Router, private supabaseService: SupabaseService, public toastController: ToastController, private navCtrl: NavController) { }

  async presentToast(message: string, duration: number = 2000) {
    const toast = await this.toastController.create({
      message,
      duration,
      position: 'bottom'
    });
    toast.present();
  }

  async Login(userLoginInfo: userLogin) {
    try {
      const usuario = await lastValueFrom(this.supabaseService.getLogin(userLoginInfo));
      if (usuario && usuario.user) {
        if (usuario.user.tipo_usuario === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/home']);
        }
      } else {
        this.presentToast("Usuario y/o Contraseña incorrectas");
      }
    } catch (error) {
      this.presentToast("Error en la autenticación. Por favor, inténtelo de nuevo.");
    }
  }
  

  ngOnInit() {
    setTimeout(() => {
      this.isLoaded = true;
    }, 800);
  }

}