import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { ChecklistService } from 'src/app/services/checklist.service';

@Component({
  selector: 'app-comment-modal',
  templateUrl: './comment-modal.component.html',
  styleUrls: ['./comment-modal.component.scss'],
})
export class CommentModalComponent implements OnInit {
  
  @Input() taskId: number | undefined; // Input para recibir el ID de la tarea
  @Input() currentComment: string = ''; // Input para recibir el comentario actual
  comment: string = ''; // Variable para el comentario en el modal

  constructor(
    private modalCtrl: ModalController,
    private checklistService: ChecklistService
  ) {}

  ngOnInit() {
    // Inicializa el comentario del modal con el comentario actual
    this.comment = this.currentComment;
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  saveComment() {
    // Guarda el comentario editado o nuevo y cierra el modal
    if (this.taskId !== undefined) {
      this.checklistService.saveTaskComment(this.taskId, this.comment).subscribe(
        () => {
          console.log('Comentario guardado en el backend:', this.comment);
          this.modalCtrl.dismiss(this.comment); // Cierra el modal después de guardar el comentario
        },
        (error) => {
          console.error('Error al guardar el comentario:', error);
          // Maneja el error según tus necesidades (mostrar mensaje al usuario, etc.)
        }
      );
    } else {
      console.error('Error: taskId is undefined');
      // Maneja el error si taskId no está definido
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
    CommentModalComponent
  ]
})
export class CommentModalComponentModule {}
