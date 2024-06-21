import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChecklistService } from 'src/app/services/checklist.service';
import { Checklist, Component as ChecklistComponent, EstadoTarea, Task } from 'src/app/models/Checklist';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.page.html',
  styleUrls: ['./checklist.page.scss'],
})
export class ChecklistPage implements OnInit {

  codigoInterno: string = '';
  checklists: Checklist[] = [];
  statuses: EstadoTarea[] = [];
  isLoadingChecklists: boolean = false; // Variable para controlar la visibilidad de la barra de carga de checklists
  isUpdatingTaskStatus: boolean = false; // Variable para controlar la visibilidad de la barra de carga al cambiar el estado de una tarea

  constructor(private route: ActivatedRoute, private checklistService: ChecklistService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.codigoInterno = params['codigo_interno'];
      this.loadChecklists();
      this.loadStatuses();
    });
  }

  loadChecklists() {
    this.isLoadingChecklists = true; // Mostrar barra de carga al iniciar la carga de checklists
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
      },
      (error) => {
        console.error('Error loading checklists:', error);
      },
      () => {
        this.isLoadingChecklists = false; // Ocultar barra de carga al finalizar la carga de checklists
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
    this.isUpdatingTaskStatus = true; // Mostrar barra de carga al cambiar el estado de la tarea
    const estadoActual = this.getStatus(task.id_tarea)?.status;
    const nuevoEstado = estadoActual === 'Finalizado' ? 'Pendiente' : 'Finalizado';
    
    // Actualizar estado en el backend
    this.checklistService.updateTaskStatus(task.id_tarea, nuevoEstado).subscribe(
      () => {
        // Actualizar estado en el frontend
        const estadoTarea = this.getStatus(task.id_tarea);
        if (estadoTarea) {
          estadoTarea.status = nuevoEstado;
        }
      },
      (error) => {
        console.error('Error updating task status:', error);
      },
      () => {
        this.isUpdatingTaskStatus = false; // Ocultar barra de carga al finalizar la actualización del estado de la tarea
      }
    );
  }
}
