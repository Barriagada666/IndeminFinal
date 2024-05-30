import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { ChecklistService } from 'src/app/services/checklist.service';
import { Checklist, Component as ChecklistComponent, Task } from 'src/app/models/Checklist';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  selectedMachineType: string = '';
  assignmentType: string = '';
  code: string = '';
  checklistId: number | null = null;
  isUpdate: boolean = false;
  machineTypes: string[] = ['Retroexcavadora', 'Bulldozer', 'Excavadora'];
  components: ChecklistComponent[] = [
    {
      id_componente: 1, // Placeholder ID
      nombre: '',
      id_checklist: 1, // Placeholder ID
      tasks: [
        { id_tarea: 1, nombre: '', id_componente: 1 } // Placeholder IDs
      ]
    }
  ];

  constructor(
    private checklistService: ChecklistService,
    private modalCtrl: ModalController,
    private toastController: ToastController
  ) {}

  ngOnInit() {}

  addComponent() {
    this.components.push({
      id_componente: this.components.length + 1,
      nombre: '',
      id_checklist: this.checklistId || 1,
      tasks: [
        { id_tarea: 1, nombre: '', id_componente: this.components.length + 1 }
      ]
    });
  }

  removeComponent(index: number) {
    this.components.splice(index, 1);
  }

  addTask(componentIndex: number) {
    const newTaskId = this.components[componentIndex].tasks.length + 1;
    this.components[componentIndex].tasks.push({
      id_tarea: newTaskId,
      nombre: '',
      id_componente: this.components[componentIndex].id_componente
    });
  }

  removeTask(componentIndex: number, taskIndex: number) {
    this.components[componentIndex].tasks.splice(taskIndex, 1);
  }

  async submitChecklist() {
    const checklistData: Checklist = {
      id_checklist: this.checklistId || 1, // Placeholder ID
      nombre: this.selectedMachineType,
      id_tipo_maquina: this.machineTypes.indexOf(this.selectedMachineType) + 1,
      codigo_interno: this.code,
      componentes: this.components
    };

    this.checklistService.createChecklist(checklistData).subscribe(
      async response => {
        if (response.error) {
          await this.presentToast(response.error, 'danger');
        } else {
          await this.presentToast('Checklist creado exitosamente', 'success');
        }
      },
      async error => {
        console.error('Esta maquina ya tiene un checklist:', error);
        await this.presentToast('El codigo interno ya tiene un checklist asignado', 'danger');
      }
    );
  }

  async confirm() {
    await this.submitChecklist();
    await this.modalCtrl.dismiss();
  }

  onWillDismiss(event: any) {
    console.log('Modal cerrado', event);
  }

  async cancel() {
    await this.modalCtrl.dismiss();
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }

  openCreateModal() {
    this.isUpdate = false;
    this.clearForm();
    const openModalButton = document.getElementById('open-modal');
    if (openModalButton !== null) {
      openModalButton.click();
    } else {
      console.error('Elemento "open-modal" no encontrado');
    }
  }

  openUpdateModal() {
    if (this.checklistId !== null) {
      this.isUpdate = true;
      this.checklistService.getChecklistById(this.checklistId).subscribe(
        async checklist => {
          this.selectedMachineType = checklist.nombre;
          this.assignmentType = 'code';
          this.code = checklist.codigo_interno;
          this.components = checklist.componentes;
          const openModalButton = document.getElementById('open-modal');
          if (openModalButton !== null) {
            openModalButton.click();
          } else {
            console.error('Elemento "open-modal" no encontrado');
          }
        },
        async error => {
          console.error('Error al obtener el checklist:', error);
          await this.presentToast('Error al obtener el checklist', 'danger');
        }
      );
    } else {
      console.error('checklistId es null');
    }
  }

  clearForm() {
    this.selectedMachineType = '';
    this.assignmentType = '';
    this.code = '';
    this.components = [
      {
        id_componente: 1, // Placeholder ID
        nombre: '',
        id_checklist: 1, // Placeholder ID
        tasks: [
          { id_tarea: 1, nombre: '', id_componente: 1 } // Placeholder IDs
        ]
      }
    ];
  }
}
