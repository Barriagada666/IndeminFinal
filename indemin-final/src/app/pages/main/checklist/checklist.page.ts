import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChecklistService } from 'src/app/services/checklist.service';
import { Checklist, Component as ChecklistComponent, EstadoTarea, Task } from 'src/app/models/Checklist';
import { ModalController, LoadingController } from '@ionic/angular';
import { CommentModalComponent } from 'src/app/comment-modal/comment-modal.component';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.page.html',
  styleUrls: ['./checklist.page.scss'],
})
export class ChecklistPage implements OnInit {

  codigoInterno: string = '';
  checklists: Checklist[] = [];
  statuses: EstadoTarea[] = [];
  isLoadingChecklists: boolean = false;
  isUpdatingTaskStatus: boolean = false;
  componentMetrics: Map<number, { totalTasks: number, finishedTasks: number }> = new Map();

  constructor(
    private route: ActivatedRoute,
    private checklistService: ChecklistService,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.codigoInterno = params['codigo_interno'];
      this.presentLoading(); // Mostrar loading al iniciar la carga
      this.loadChecklists();
      this.loadStatuses();
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

  loadStatuses(): void {
    this.checklistService.getStatus().subscribe(
      (data) => {
        this.statuses = data;
      },
      (error) => {
        console.error('Error loading statuses:', error);
      }
    );
  }

  getStatus(taskId: number): EstadoTarea | undefined {
    return this.statuses.find(status => status.id_tarea === taskId);
  }

  toggleTaskStatus(task: Task): void {
    this.isUpdatingTaskStatus = true;
    const estadoActual = this.getStatus(task.id_tarea)?.status;
    const nuevoEstado = estadoActual === 'Finalizado' ? 'Pendiente' : 'Finalizado';

    this.checklistService.updateTaskStatus(task.id_tarea, nuevoEstado).subscribe(
      () => {
        const estadoTarea = this.getStatus(task.id_tarea);
        if (estadoTarea) {
          estadoTarea.status = nuevoEstado;
        }
        this.calculateTasksMetrics();
        this.presentStatusToast(nuevoEstado);
      },
      (error) => {
        console.error('Error updating task status:', error);
      },
      () => {
        this.isUpdatingTaskStatus = false;
      }
    );
  }

  async presentStatusToast(status: string) {
    const toast = await this.toastController.create({
      message: `Estado actual: ${status}`,
      duration: 1500, // 
      position: 'bottom', //
      cssClass: 'custom-toast' // 
    });

    await toast.present();
  }

  getBadgeColor(status: string | undefined): string {
    if (!status) {
      return 'medium';
    }
    return status.toLowerCase() === 'finalizado' ? 'success' : 'warning';
  }

  async openCommentModal(task: Task) {
    const modal = await this.modalCtrl.create({
      component: CommentModalComponent,
      componentProps: {
        taskId: task.id_tarea,
        currentComment: this.getStatus(task.id_tarea)?.comment
      }
    });

    modal.onDidDismiss().then((data) => {
      if (data && data.data) {
        const estadoTarea = this.getStatus(task.id_tarea);
        if (estadoTarea) {
          estadoTarea.comment = data.data;
        }
        this.calculateTasksMetrics();
      }
    });

    return await modal.present();
  }

  calculateTasksMetrics(): void {
    this.componentMetrics.clear();

    this.checklists.forEach(checklist => {
      checklist.componentes.forEach(component => {
        let totalTasks = 0;
        let finishedTasks = 0;

        component.tasks.forEach(task => {
          totalTasks++;
          if (this.getStatus(task.id_tarea)?.status === 'Finalizado') {
            finishedTasks++;
          }
        });

        this.componentMetrics.set(component.id_componente, { totalTasks, finishedTasks });
      });
    });
  }

  // Obtener métricas de tareas por componente
  getComponentMetrics(componentId: number): { totalTasks: number, finishedTasks: number } | undefined {
    return this.componentMetrics.get(componentId);
  }

  // Calcular ancho de la barra de progreso segmentada por componente
  getProgressSegmentWidth(component: ChecklistComponent): string {
    const metrics = this.getComponentMetrics(component.id_componente);
    if (!metrics || metrics.totalTasks === 0) {
      return '0%';
    }
    const percentage = (metrics.finishedTasks / metrics.totalTasks) * 100;
    return `${percentage}%`;
  }

  // Obtener color de la barra de progreso según el estado
  getProgressBarColor(componentId: number): string {
    const metrics = this.getComponentMetrics(componentId);
    if (!metrics) {
      return 'gray'; // Color predeterminado si no hay métricas disponibles
    }
    if (metrics.finishedTasks === metrics.totalTasks) {
      return 'green'; // Si todas las tareas están completadas
    }
    return 'yellow'; // Color predeterminado para la barra de progreso
  }

}
