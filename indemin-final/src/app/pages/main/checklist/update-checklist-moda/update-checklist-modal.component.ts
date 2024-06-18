import { Component, NgModule } from '@angular/core';
import { ModalController, IonicModule, AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChecklistService } from 'src/app/services/checklist.service';
import { Checklist, Component as Componente, Task } from 'src/app/models/Checklist'; // Ajusta los nombres de tus interfaces según sea necesario

@Component({
  selector: 'app-update-checklist-modal',
  templateUrl: 'update-checklist-modal.component.html',
  styleUrls: ['update-checklist-modal.component.scss'],
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
  components: Componente[] = [];
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
      const componente = this.components[componentIndex];
      if (this.newTaskName.trim() !== '') { // Verifica si el nombre de la tarea no está vacío
        const newTask: Task = {
          nombre: this.newTaskName.trim(),
          id_tarea: 0, // Debes asegurarte de que este valor sea correcto según tu backend
          id_componente: componente.id_componente // Asigna el id_componente correspondiente
        };
        componente.tasks.push(newTask);
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
      const componente = this.components[componentIndex];
      if (taskIndex >= 0 && taskIndex < componente.tasks.length) {
        componente.tasks[taskIndex] = updatedTask;
      }
    }
  }

  saveChanges() {
    if (this.checklist && this.selectedMachineType !== null) {
      const updatedChecklist: Checklist = {
        ...this.checklist,
        id_tipo_maquina: this.selectedMachineType,
        componentes: this.components.map(componente => ({
          id_componente: componente.id_componente,
          nombre: componente.nombre,
          id_checklist: componente.id_checklist,
          tasks: componente.tasks.map(task => ({
            id_tarea: task.id_tarea,
            nombre: task.nombre,
            id_componente: task.id_componente
          }))
        }))
      };
  
      console.log('JSON enviado al servidor:', updatedChecklist); // Mostrar el JSON antes de enviarlo
  
      this.checklistService.editChecklist(this.checklist.id_checklist, updatedChecklist).subscribe(
        (response) => {
          console.log('Checklist updated successfully', response);
          this.closeModal();
        },
        (error) => {
          console.error('Error updating checklist', error);
          if (error.status === 500) {
            this.showErrorAlert('Error interno del servidor. Inténtalo de nuevo más tarde.');
          } else {
            this.showErrorAlert('Error al actualizar el checklist. Verifica los datos e inténtalo de nuevo.');
          }
        }
      );
    } else {
      console.error('Checklist is null or machine type not selected');
      this.showErrorAlert('No se pudo actualizar el checklist. Asegúrate de seleccionar una máquina y tener un checklist válido.');
    }
  }
  
  private async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
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
