import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController, ToastController } from '@ionic/angular';
import { ChecklistService } from 'src/app/services/checklist.service';
import { Router } from '@angular/router';
import { UpdateChecklistModalComponent } from '../checklist/update-checklist-moda/update-checklist-modal.component';

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
  machineTypes: string[] = [];
  componentes: any[] = [];
  maquinas: any[] = [];

  constructor(
    private checklistService: ChecklistService,
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private router: Router,
    private menu: MenuController
  ) {}

  ngOnInit() {
  }

  buscarMaquina() {
    if (this.code.length >= 2) { // Ajusta el valor mínimo según lo necesario
      this.checklistService.getMaquinasByCodigoInterno(this.code).subscribe(
        (maquinas: any[]) => {
          this.maquinas = maquinas;
        },
        (error: any) => {
          console.error('Error al buscar máquina:', error);
        }
      );
    } else {
      this.maquinas = [];
    }
  }

  addComponent() {
    this.componentes.push({
      id_componente: this.componentes.length + 1,
      nombre: '',
      id_checklist: this.checklistId || 1,
      tasks: [
        { id_tarea: 1, nombre: '', id_componente: this.componentes.length + 1 }
      ]
    });
  }

  removeComponent(index: number) {
    this.componentes.splice(index, 1);
  }

  addTask(componentIndex: number) {
    const newTaskId = this.componentes[componentIndex].tasks.length + 1;
    this.componentes[componentIndex].tasks.push({
      id_tarea: newTaskId,
      nombre: '',
      id_componente: this.componentes[componentIndex].id_componente
    });
  }

  removeTask(componentIndex: number, taskIndex: number) {
    this.componentes[componentIndex].tasks.splice(taskIndex, 1);
  }

  async submitChecklist() {
    const checklistData = {
      id_checklist: this.checklistId || 1, // Placeholder ID
      nombre: this.selectedMachineType,
      id_tipo_maquina: this.machineTypes.indexOf(this.selectedMachineType) + 1,
      codigo_interno: this.code,
      componentes: this.componentes
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
        console.error('Esta máquina ya tiene un checklist:', error);
        await this.presentToast('El código interno ya tiene un checklist asignado', 'danger');
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

  async openUpdateModal() {
    this.isUpdate = true;
    const modal = await this.modalCtrl.create({
      component: UpdateChecklistModalComponent,
      componentProps: { isUpdate: true, checklistData: null } // Puedes pasar null como checklistData si no tienes datos disponibles
    });
    await modal.present();
  }

  async closeMenu() {
    if (await this.menu.isOpen('main-menu')) {
      this.menu.close('main-menu');
    }
  }

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
    this.closeMenu();
  }

  clearForm() {
    this.selectedMachineType = '';
    this.assignmentType = '';
    this.code = '';
    this.componentes = [
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
