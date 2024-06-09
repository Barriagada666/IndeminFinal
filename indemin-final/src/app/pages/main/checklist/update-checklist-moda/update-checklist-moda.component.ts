import { Component, NgModule } from '@angular/core';
import { ModalController, IonicModule, AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChecklistService } from 'src/app/services/checklist.service';
import { Checklist, Component as ChecklistComponent, Task } from 'src/app/models/Checklist';

@Component({
  selector: 'app-update-checklist-moda',
  templateUrl: 'update-checklist-moda.component.html',
  styleUrls: ['update-checklist-moda.component.scss'],
})
export class UpdateChecklistModalComponent {
  searchQuery: string = '';
  errorBusqueda: boolean = false;
  checklist: Checklist | null = null;
  isEditModalOpen: boolean = false;
  selectedMachineType: number | null = null;
  machineTypes: { id: number, name: string }[] = [
    { id: 1, name: 'Retroexcavadora' },
    { id: 2, name: 'Bulldozer' },
    { id: 3, name: 'Excavadora' }
  ];
  components: ChecklistComponent[] = [];
  newTaskName: string = '';
  showAlert: boolean = false; // Variable para controlar la visibilidad del alerta

  constructor(
    private modalController: ModalController,
    private checklistService: ChecklistService,
    private alertController: AlertController // Inyecta el servicio AlertController
  ) {}

  closeModal() {
    this.modalController.dismiss();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Advertencia',
      message: 'El nombre de la tarea no puede estar vacío.',
      buttons: ['OK']
    });

    await alert.present();
  }

  searchMachine() {
    this.errorBusqueda = false;
    this.checklist = null;

    if (this.searchQuery.trim() !== '') {
      this.checklistService.getChecklistByCodigoInterno(this.searchQuery).subscribe(
        (checklists: Checklist[]) => {
          if (checklists.length === 0) {
            this.errorBusqueda = true;
          } else {
            this.checklist = checklists[0];
            this.selectedMachineType = this.checklist.id_tipo_maquina;
            this.components = this.checklist.componentes;
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

  clearForm() {
    this.selectedMachineType = null;
    this.components = [];
  }

  addComponent() {
    this.components.push({ id_componente: 0, nombre: '', id_checklist: 0, tasks: [] });
  }

  removeComponent(index: number) {
    if (index >= 0 && index < this.components.length) {
      this.components.splice(index, 1);
    }
  }

  addTask(componentIndex: number) {
    if (componentIndex >= 0 && componentIndex < this.components.length) {
      const component = this.components[componentIndex];
      if (this.newTaskName.trim() !== '') { // Verifica si el nombre de la tarea no está vacío
        const newTask: Task = {
          nombre: this.newTaskName.trim(),
          completed: false,
          id_tarea: 0,
          id_componente: 0
        };
        component.tasks.push(newTask);
        this.newTaskName = ''; // Limpiar el campo después de agregar la tarea
        this.showAlert = false; // Ocultar el alerta si se agregó la tarea correctamente
      } else {
        this.showAlert = true; // Mostrar el alerta si el nombre de la tarea está vacío
        this.presentAlert(); // Llama a la función para mostrar el alerta
      }
    }
  }

  removeTask(componentIndex: number, taskIndex: number) {
    if (componentIndex >= 0 && componentIndex < this.components.length) {
      const tasks = this.components[componentIndex].tasks;
      if (taskIndex >= 0 && taskIndex < tasks.length) {
        tasks.splice(taskIndex, 1);
      }
    }
  }

  editTask(componentIndex: number, taskIndex: number, updatedTask: Task) {
    if (componentIndex >= 0 && componentIndex < this.components.length) {
      const component = this.components[componentIndex];
      if (taskIndex >= 0 && taskIndex < component.tasks.length) {
        component.tasks[taskIndex] = updatedTask;
      }
    }
  }

  saveChanges() {
    if (this.checklist && this.selectedMachineType !== null) {
      const updatedChecklist: Checklist = {
        ...this.checklist,
        id_tipo_maquina: this.selectedMachineType,
        componentes: this.components,
        // Otros campos del checklist que necesitan actualizarse
      };

      this.checklistService.editChecklist(this.checklist.id_checklist, updatedChecklist).subscribe(
        (response) => {
          console.log('Checklist updated successfully');
          this.closeModal();
        },
        (error) => {
          console.error('Error updating checklist', error);
        }
      );
    } else {
      console.error('Checklist is null or machine type not selected');
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
