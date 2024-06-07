import { Component, NgModule } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChecklistService } from 'src/app/services/checklist.service';
import { Checklist } from 'src/app/models/Checklist';

@Component({
  selector: 'app-update-checklist-moda',
  templateUrl: 'update-checklist-moda.component.html',
  styleUrls: ['update-checklist-moda.component.scss'],
})
export class UpdateChecklistModalComponent {
  searchQuery: string = '';
  errorBusqueda: boolean = false;
  checklist: Checklist | null = null;

  constructor(private modalController: ModalController, private checklistService: ChecklistService) {}

  closeModal() {
    this.modalController.dismiss();
  }

  buscarMaquina() {
    this.errorBusqueda = false;
    this.checklist = null;

    if (this.searchQuery.trim() !== '') {
      this.checklistService.getChecklistByCodigoInterno(this.searchQuery).subscribe(
        (checklists: Checklist[]) => {
          if (checklists.length === 0) {
            this.errorBusqueda = true;
          } else {
            this.checklist = checklists[0];
            console.log('Checklist encontrado:', this.checklist);
          }
        },
        (error) => {
          console.error('Error al buscar la máquina:', error);
          this.errorBusqueda = true;
        }
      );
    } else {
      this.errorBusqueda = true;
    }
  }
}

@NgModule({
  imports: [
    IonicModule,
    FormsModule,
    CommonModule
  ],
  declarations: [
    UpdateChecklistModalComponent
  ]
})
export class UpdateChecklistModalModule {}
