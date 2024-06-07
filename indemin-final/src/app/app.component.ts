import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UpdateChecklistModalComponent } from './pages/main/checklist/update-checklist-moda/update-checklist-moda.component'; // Asegúrate de que la ruta al componente sea correcta

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isUpdate: boolean = false;

  constructor(private modalController: ModalController) {}

  async openCreateModal() {
    this.isUpdate = false;
    const modal = await this.modalController.create({
      component: UpdateChecklistModalComponent,
      componentProps: { isUpdate: this.isUpdate },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    console.log('Modal cerrado', data);
  }
}
