import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChecklistService } from 'src/app/services/checklist.service';
import { Checklist, Component as ChecklistComponent, ChecklistRealizado, Task } from 'src/app/models/Checklist';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { ChecklistRealizadoService } from 'src/app/services/checklist-realizado.service'; // Importa el servicio ChecklistRealizadoService

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.page.html',
  styleUrls: ['./checklist.page.scss'],
})
export class ChecklistPage implements OnInit {
  loggedUserId: number = parseInt(localStorage.getItem('userId') || '0');
  codigoInterno: string = '';
  checklists: Checklist[] = [];
  isLoadingChecklists: boolean = false;
  isUpdatingTaskStatus: boolean = false;
  componentMetrics: Map<number, { totalTasks: number, finishedTasks: number }> = new Map();
  taskStatuses: { [key: number]: string } = {};
  id_checklist: number = 0;
  observaciones: string = '';

  constructor(
    private route: ActivatedRoute,
    private checklistService: ChecklistService,
    private checklistRealizadoService: ChecklistRealizadoService, // Inyecta el servicio ChecklistRealizadoService
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.codigoInterno = params['codigo_interno'];
      this.presentLoading(); // Mostrar loading al iniciar la carga
      this.loadChecklists();
      this.loggedUserId = parseInt(localStorage.getItem('userId') || '0');
    });
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando checklist...',
    });
    await loading.present();
  }

  dismissLoading() {
    this.loadingCtrl.dismiss();
  }

  loadChecklists() {
    this.isLoadingChecklists = true;
    this.checklistService.getChecklistByCodigoInterno(this.codigoInterno).subscribe(
      (data: Checklist[]) => {
        this.checklists = data.map(checklist => ({
          ...checklist,
          componentes: checklist.componentes ? checklist.componentes.map((component: ChecklistComponent) => ({
            ...component,
            tasks: component.tasks ? component.tasks.map((task: Task) => ({
              ...task
            })) : []
          })) : []
        }));

        // Asignar el id_checklist al primer elemento de la lista
        if (this.checklists.length > 0) {
          this.id_checklist = this.checklists[0].id_checklist; // Asignar el primer id_checklist
        }

        // Inicializar estados de tareas
        this.checklists.forEach(checklist => {
          checklist.componentes.forEach(component => {
            component.tasks.forEach(task => {
              this.taskStatuses[task.id_tarea] = 'gray'; // Inicializar en 'gray', 'green', 'red', etc.
            });
          });
        });

        this.calculateTasksMetrics();
      },
      (error) => {
        console.error('Error loading checklists:', error);
      },
      () => {
        this.isLoadingChecklists = false;
        this.dismissLoading(); // Ocultar loading al finalizar la carga
      }
    );
  }

  toggleTaskStatus(taskId: number) {
    if (!this.taskStatuses[taskId]) {
      this.taskStatuses[taskId] = 'gray';
    } else if (this.taskStatuses[taskId] === 'gray') {
      this.taskStatuses[taskId] = 'green';
    } else if (this.taskStatuses[taskId] === 'green') {
      this.taskStatuses[taskId] = 'red';
    } else {
      this.taskStatuses[taskId] = 'gray';
    }
    this.calculateTasksMetrics();
  }

  getButtonColor(taskId: number): string {
    if (!this.taskStatuses[taskId]) {
      return 'medium';
    } else if (this.taskStatuses[taskId] === 'gray') {
      return 'medium';
    } else if (this.taskStatuses[taskId] === 'green') {
      return 'success';
    } else if (this.taskStatuses[taskId] === 'red') {
      return 'danger';
    }
    return 'medium';
  }

  getButtonIcon(taskId: number): string {
    if (!this.taskStatuses[taskId]) {
      return 'ellipse-outline';
    } else if (this.taskStatuses[taskId] === 'gray') {
      return 'ellipse-outline';
    } else if (this.taskStatuses[taskId] === 'green') {
      return 'checkmark-outline';
    } else if (this.taskStatuses[taskId] === 'red') {
      return 'close-outline';
    }
    return 'ellipse-outline';
  }

  calculateTasksMetrics(): void {
    this.componentMetrics.clear();

    this.checklists.forEach(checklist => {
      checklist.componentes.forEach(component => {
        let totalTasks = 0;
        let finishedTasks = 0;

        component.tasks.forEach(task => {
          totalTasks++;
          if (this.taskStatuses[task.id_tarea] === 'green') {
            finishedTasks++;
          }
        });

        this.componentMetrics.set(component.id_componente, { totalTasks, finishedTasks });
      });
    });
  }

  getComponentMetrics(componentId: number): { totalTasks: number, finishedTasks: number } | undefined {
    return this.componentMetrics.get(componentId);
  }

  getProgressSegmentWidth(component: ChecklistComponent): string {
    const metrics = this.getComponentMetrics(component.id_componente);
    if (!metrics || metrics.totalTasks === 0) {
      return '0%';
    }
    const percentage = (metrics.finishedTasks / metrics.totalTasks) * 100;
    return `${percentage}%`;
  }

  getProgressBarColor(componentId: number): string {
    const metrics = this.getComponentMetrics(componentId);
    if (!metrics) {
      return 'gray'; // Color por defecto si no hay métricas disponibles
    }
    if (metrics.finishedTasks === metrics.totalTasks) {
      return 'green'; // Color verde si todas las tareas están completadas
    }
    return 'yellow'; // Color amarillo si hay tareas incompletas
  }

  async presentIncompleteTasksAlert(componentName: string, taskName: string) {
    const alert = await this.alertController.create({
      header: 'Tarea sin completar',
      message: `La tarea '${taskName}' del componente '${componentName}' no está completada. Debes completar todas las tareas antes de guardar.`,
      buttons: ['OK']
    });

    await alert.present();
  }

  onSubmit() {
    let incompleteTaskFound = false;
  
    this.checklists.forEach(checklist => {
      checklist.componentes.forEach(component => {
        component.tasks.forEach(task => {
          if (this.taskStatuses[task.id_tarea] !== 'green') {
            this.presentIncompleteTasksAlert(component.nombre, task.nombre);
            incompleteTaskFound = true;
          }
        });
      });
    });
  
    if (!incompleteTaskFound) {
      const checklistRealizado: ChecklistRealizado = {
        id_checklist: this.id_checklist,
        id_usuario: this.loggedUserId,
        fecha_realizacion: new Date().toISOString(),
        comentarios: this.observaciones
      };
  
      // Mostrar los datos que se enviarán al backend en la consola
      console.log('Datos a enviar al backend:', checklistRealizado);
  
      // Lógica para enviar los datos al backend
      this.checklistRealizadoService.guardarChecklist(checklistRealizado).subscribe(
        response => {
          console.log('Respuesta del backend:', response);
          // Aquí puedes manejar la respuesta del backend si es necesario
          // Por ejemplo, mostrar un mensaje de éxito o navegar a otra página
        },
        error => {
          console.error('Error al guardar el checklist:', error);
          // Aquí puedes manejar el error si ocurre alguno
          // Por ejemplo, mostrar un mensaje de error al usuario
        }
      );
    }
  }

}
