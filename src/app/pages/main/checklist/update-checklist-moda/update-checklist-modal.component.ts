import { Component, NgModule, OnInit } from '@angular/core';
import { ModalController, IonicModule, AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Maquina } from 'src/app/models/Maquina';
import { ChecklistService } from 'src/app/services/checklist.service';
import { MaquinaService } from 'src/app/services/maquina.service'; // Importa MaquinaService
import { Checklist, Component as Componente, Task, EstadoTarea } from 'src/app/models/Checklist'; // Importa EstadoTarea

@Component({
  selector: 'app-update-checklist-modal',
  templateUrl: 'update-checklist-modal.component.html',
  styleUrls: ['update-checklist-modal.component.scss'],
})
export class UpdateChecklistModalComponent implements OnInit {
  searchQuery: string = '';
  errorBusqueda: boolean = false;
  checklist: Checklist | null = null;
  isEditModalOpen: boolean = false;
  selectedMachineType: number | null = null;
  machineTypes: { id: number, name: string }[] = [];
  components: Componente[] = [];
  newTaskName: string[] = []; // Inicializar como un arreglo vacío
  showAlert: boolean = false;
  filteredMaquinas: Maquina[] = [];
  isLoading: boolean = false; // Variable para controlar la visibilidad de la barra de carga
  progressValue: number = 0;

  constructor(
    private modalController: ModalController,
    private checklistService: ChecklistService,
    private maquinaService: MaquinaService, // Añade MaquinaService aquí
    private alertController: AlertController
  ) {}

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
    this.searchQuery = codigo;
    this.filteredMaquinas = [];
  }

  closeModal() {
    this.modalController.dismiss();
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Advertencia',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  searchMachine() {
    this.errorBusqueda = false;
    this.checklist = null;
    this.isLoading = true; // Activar la barra de carga al iniciar la búsqueda
    this.progressValue = 0; // Reiniciar el progreso

    if (this.searchQuery.trim() !== '') {
      this.maquinaService.getMachines(this.searchQuery).subscribe(
        (maquinas) => {
          if (maquinas.length === 0) {
            this.errorBusqueda = true;
          } else {
            const maquina = maquinas[0];
            this.checklistService.getChecklistByCodigoInterno(maquina.codigo_interno).subscribe(
              (checklists: Checklist[]) => {
                if (checklists.length === 0) {
                  this.errorBusqueda = true;
                } else {
                  this.checklist = checklists[0];
                  this.selectedMachineType = this.checklist.id_tipo_maquina;
                  this.components = this.checklist.componentes;
                  console.log('Checklist encontrado:', this.checklist);
                }
                this.isLoading = false; // Desactivar la barra de carga al finalizar la búsqueda
              },
              (error) => {
                console.error('Error al buscar el checklist:', error);
                this.errorBusqueda = true;
                this.isLoading = false; // Desactivar la barra de carga en caso de error
              }
            );
          }
        },
        (error) => {
          console.error('Error al buscar la máquina:', error);
          this.errorBusqueda = true;
          this.isLoading = false; // Desactivar la barra de carga en caso de error
        }
      );
    } else {
      this.errorBusqueda = true;
      this.isLoading = false; // Desactivar la barra de carga si no hay consulta válida
    }
  }
  

  clearForm() {
    this.selectedMachineType = null;
    this.components = [];
  }

  addComponent() {
    this.components.push({ id_componente: 0, nombre: '', id_checklist: 0, tasks: [] });
    this.newTaskName.push(''); // Añadir un nuevo campo para la nueva tarea
  }

  removeComponent(index: number) {
    if (index >= 0 && index < this.components.length) {
      this.components.splice(index, 1);
      this.newTaskName.splice(index, 1); // Eliminar el campo correspondiente en newTaskName
    }
  }

  addTask(componentIndex: number) {
    if (componentIndex >= 0 && componentIndex < this.components.length) {
      const componente = this.components[componentIndex];
      if (this.newTaskName[componentIndex].trim() !== '') {
        const newTask: Task = {
          nombre: this.newTaskName[componentIndex].trim(),
          id_tarea: 0,
          id_componente: componente.id_componente,
          status: [] // Inicializa el campo status como un array vacío de EstadoTarea
        };
        componente.tasks.push(newTask);
        this.newTaskName[componentIndex] = ''; // Limpiar el campo después de agregar la tarea
        this.showAlert = false;
      } else {
        this.showAlert = true;
        this.presentAlert('El nombre de la tarea no puede estar vacío.');
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
            id_componente: task.id_componente,
            status: task.status // Incluye el campo status en la copia de tareas
          })
        
        
        )
        }))
      };
  
      console.log('JSON enviado al servidor:', updatedChecklist);
  
      // Activar la barra de carga
      this.isLoading = true;
      this.progressValue = 0; // Puedes ajustar el valor de progreso inicial si es necesario
  
      this.checklistService.editChecklist(this.checklist.id_checklist, updatedChecklist).subscribe(
        (response) => {
          console.log('Checklist updated successfully', response);
          // Cerrar la barra de carga y modal al completar la solicitud
          this.isLoading = false;
          this.progressValue = 100; // Actualiza el valor de progreso al completar
  
          this.closeModal();
        },
        (error) => {
          console.error('Error updating checklist', error);
          this.isLoading = false; // Ocultar la barra de carga en caso de error
          this.presentAlert('Error al actualizar el checklist. Verifica los datos e inténtalo de nuevo.');
        }
      );
    } else {
      console.error('Checklist is null or machine type not selected');
      this.presentAlert('No se pudo actualizar el checklist. Asegúrate de seleccionar una máquina y tener un checklist válido.');
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
