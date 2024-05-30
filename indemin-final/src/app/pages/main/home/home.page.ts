import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MaquinaService } from 'src/app/services/maquina.service';
import { Maquina } from 'src/app/models/Maquina';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  maquina = {
    codigo_interno: ''
  };
  maquinas: Maquina[] = [];
  filteredMaquinas: Maquina[] = [];

  constructor(
    private router: Router,
    private maquinaService: MaquinaService
  ) {}

  ngOnInit() {}

  filterMaquinas(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm) {
      this.maquinaService.getMachines(searchTerm).subscribe(
        (data: Maquina[]) => {
          this.filteredMaquinas = data;
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      this.filteredMaquinas = [];
    }
  }

  selectMaquina(codigo: string) {
    this.maquina.codigo_interno = codigo;
    this.filteredMaquinas = [];
  }

  buscarMaquina() {
    const codigo = this.maquina.codigo_interno;
    console.log('Buscando máquina con código:', codigo);
    this.router.navigate(['/checklist'], { queryParams: { codigo_interno: codigo } });
  }
}