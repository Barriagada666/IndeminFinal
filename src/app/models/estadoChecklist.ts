export interface Checklists {
    id_checklist: number;
    nombre: string;
    id_tipo_maquina: number;
    componentes: ChecklistComponent[];
}

export interface ChecklistComponent {
    id_componente: number;
    nombre: string;
    tasks: Task[];
}

export interface Task {
    id_tarea: number;
    nombre: string;
}

export interface EstadoTarea {
    id_status: number;
    id_tarea: number;
    status: string;
}


export interface EstadoTareaRealizada {
    id_estado_tarea: number;
    id_checklist_realizado: number;
    id_tarea: number;
    estado: string;
}


