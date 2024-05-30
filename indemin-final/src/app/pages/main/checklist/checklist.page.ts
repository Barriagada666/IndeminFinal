import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChecklistService } from 'src/app/services/checklist.service';
import { Checklist, Component as ChecklistComponent, Task } from 'src/app/models/Checklist';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.page.html',
  styleUrls: ['./checklist.page.scss'],
})
export class ChecklistPage implements OnInit {

  codigoInterno: string = '';
  checklists: Checklist[] = [];

  constructor(private route: ActivatedRoute, private checklistService: ChecklistService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.codigoInterno = params['codigo_interno'];
      this.loadChecklists();
    });
  }

  loadChecklists() {
    this.checklistService.getChecklistByCodigoInterno(this.codigoInterno).subscribe(
      (data: Checklist[]) => {
        console.log('Data received:', data);
        this.checklists = data.map(checklist => ({
          ...checklist,
          componentes: checklist.componentes ? checklist.componentes.map((component: ChecklistComponent) => ({
            ...component,
            tasks: component.tasks ? component.tasks.map((task: Task) => ({ ...task, completed: false })) : []
          })) : []
        }));
        console.log('Processed checklists:', this.checklists);
      },
      (error) => {
        console.error('Error loading checklists:', error);
      }
    );
  }
}