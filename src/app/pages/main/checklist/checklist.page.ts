import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChecklistService } from 'src/app/services/checklist.service';
import { Checklist, Component as ChecklistComponent, EstadoTarea, RealizarChecklistRequest, Task } from 'src/app/models/Checklist';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { ChecklistRealizadoService } from 'src/app/services/checklist-realizado.service'; // Importa el servicio ChecklistRealizadoService
import { Observable, forkJoin, throwError } from 'rxjs';
import { Router } from '@angular/router';

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
    private router: Router,
    private checklistService: ChecklistService,
    private checklistRealizado: ChecklistRealizadoService,
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

  async LoadingBoton() {
    const loading  = await this.loadingCtrl.create({
      message: 'Enviando checklist...'
    });
    await loading.present()
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
    let redTaskWithoutCommentFound = false;
  
    // Recorrer cada checklist, componente y tarea para verificar el estado de las tareas
    this.checklists.forEach(checklist => {
      checklist.componentes.forEach(component => {
        component.tasks.forEach(task => {
          const taskStatus = this.taskStatuses[task.id_tarea];
          if (taskStatus !== 'green' && taskStatus !== 'red') {
            this.presentIncompleteTasksAlert(component.nombre, task.nombre);
            incompleteTaskFound = true;
          } else if (taskStatus === 'red' && (!this.observaciones || this.observaciones.trim() === '')) {
            this.presentRedTaskWithoutCommentAlert(component.nombre, task.nombre);
            redTaskWithoutCommentFound = true;
          }
        });
      });
    });
  
    // Si se encontraron tareas incompletas o tareas en rojo sin comentario, salir sin enviar el checklist
    if (incompleteTaskFound || redTaskWithoutCommentFound) {
      return;
    }
  
    // Preparar objeto para enviar al backend
    this.LoadingBoton();
    const updateTasksObservables: Observable<any>[] = []; // Declarar como array de Observables<any>
  
    this.checklists.forEach(checklist => {
      checklist.componentes.forEach(component => {
        component.tasks.forEach(task => {
          const taskId = task.id_tarea;
          let newStatus = this.taskStatuses[taskId];
  
          // Transformar 'green' a 'Realizado' y 'red' a 'No Realizado'
          if (newStatus === 'green') {
            newStatus = 'Realizado';
          } else if (newStatus === 'red') {
            newStatus = 'No Realizado';
          }
  
          // Hacer patch al estado de la tarea y guardar el observable en un arreglo
          const updateObservable = this.checklistRealizado.updateTaskStatus(taskId, newStatus);
          updateTasksObservables.push(updateObservable);
        });
      });
    });
  
    // Ejecutar todas las actualizaciones de estado en paralelo usando forkJoin
    forkJoin(updateTasksObservables).subscribe(() => {
      // Obtener la hora local del dispositivo en formato adecuado para la base de datos
      const now = new Date();
      const offset = now.getTimezoneOffset() * 60000; // Offset en milisegundos
      const localDateTime = new Date(now.getTime() - offset).toISOString().slice(0, 19).replace('T', ' ');
  
      const checklistRealizado: RealizarChecklistRequest = {
        id_checklist: this.id_checklist,
        fecha_realizacion: localDateTime, // Usar la hora local del dispositivo
        comentarios: this.observaciones,
        estados_tareas: []
      };
  
      // Construir el arreglo de estados de tareas
      this.checklists.forEach(checklist => {
        checklist.componentes.forEach(component => {
          component.tasks.forEach(task => {
            const estadoTarea: EstadoTarea = {
              id_tarea: task.id_tarea,
              status: this.taskStatuses[task.id_tarea]
            };
  
            // Transformar 'green' a 'Realizado' y 'red' a 'No Realizado' en el estado de la tarea
            if (estadoTarea.status === 'green') {
              estadoTarea.status = 'Realizado';
            } else if (estadoTarea.status === 'red') {
              estadoTarea.status = 'No Realizado';
            }
  
            checklistRealizado.estados_tareas.push(estadoTarea);
          });
        });
      });
  
      // Mostrar los datos que se enviarán al backend en la consola
      console.log('Datos a enviar al backend:', checklistRealizado);
  
      // Lógica para enviar los datos al backend
      this.checklistRealizado.guardarChecklist(checklistRealizado).subscribe(
        response => {
          console.log('Respuesta del backend:', response);
          this.dismissLoading(); // Ocultar loading al finalizar el envío
          this.presentSuccessAlert();
        },
    )
    this.dismissLoading(); // Ocultar loading al finalizar el envío
    this.presentSuccessAlert();
  });
  }

  async presentSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Datos Enviados',
      message: 'Los datos han sido enviados correctamente.',
      buttons: [{
        text: 'OK',
        handler: () => {
          this.router.navigateByUrl('/home'); // Navegar al home al presionar OK
        }
      }]
    });

    await alert.present();
  }
  async presentRedTaskWithoutCommentAlert(componentName: string, taskName: string) {
    const alert = await this.alertController.create({
      header: 'Tarea sin Realizar y sin observación',
      message: `La tarea '${taskName}' del componente '${componentName}' está sin realizar y requiere una Observación.`,
      buttons: ['OK']
    });

    await alert.present();
  }

}
