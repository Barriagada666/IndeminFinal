import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MaquinaService } from 'src/app/services/maquina.service';
import { Maquina } from 'src/app/models/Maquina';
import { Platform, AlertController } from '@ionic/angular';
import { App } from '@capacitor/app';  // Importa App de Capacitor

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  maquina = {
    codigo_interno: ''
  };
  maquinas: Maquina[] = [];
  filteredMaquinas: Maquina[] = [];

  constructor(
    private router: Router,
    private maquinaService: MaquinaService,
    private platform: Platform,
    private alertController: AlertController
  ) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.showExitConfirm();
    });
  }

  ngOnInit() {}

  filterMaquinas(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm) {
      this.maquinaService.getMachines(searchTerm).subscribe(
        (data: Maquina[]) => {
          this.filteredMaquinas = data;
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      this.filteredMaquinas = [];
    }
  }

  selectMaquina(codigo: string) {
    this.maquina.codigo_interno = codigo;
    this.filteredMaquinas = [];
  }

  buscarMaquina() {
    const codigo = this.maquina.codigo_interno;
    console.log('Buscando máquina con código:', codigo);
    this.router.navigate(['/checklist'], { queryParams: { codigo_interno: codigo } });
  }

  async showExitConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirm Exit',
      message: 'Do you want to exit the app?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Exit canceled');
          }
        },
        {
          text: 'OK',
          handler: () => {
            App.exitApp();  // Usar App de Capacitor para salir de la aplicación
          }
        }
      ]
    });

    await alert.present();
  }
}
