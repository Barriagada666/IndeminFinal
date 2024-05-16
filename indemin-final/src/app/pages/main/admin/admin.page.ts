import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  onWillDismiss(event: any) {
    // Implementa la lógica para manejar el evento de dismiss
  }

  confirm() {
    // Implementa la lógica para confirmar
  }

  name: string = '';

  constructor(private modalController: ModalController) {}

  ngOnInit() {
  }

  async cancel() {
    await this.modalController.dismiss();
  }

}
