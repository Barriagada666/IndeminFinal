export interface Task {
    id_tarea: number;
    nombre: string;
    frecuencia?: string;
    id_componente: number;
    status: EstadoTarea[]
}

export interface Component {
    id_componente: number;
    nombre: string;
    id_checklist: number;
    tasks: Task[];
}

export interface Checklist {
    codigo_interno: string;
    id_checklist: number;
    nombre: string;
    id_tipo_maquina: number;
    componentes: Component[];
}

export interface EstadoTarea {
    id_tarea: number; // 
    status: string; // 
    comment: string; //
  }