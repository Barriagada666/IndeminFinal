import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
})
export class CustomInputComponent  implements OnInit {

  @Input() control!: FormControl;
  @Input() type!: string;
  @Input() label!: string;
  @Input() autocomplete!: string;
  @Input() icon!: string;

  isPassword!: boolean;
  hide: boolean = true;
  inputId: string;


  constructor() { 
    this.inputId = '';
  }

  ngOnInit() {
    this.inputId = `input-${Math.random().toString(36).substr(2, 9)}`; // Generar un ID único al inicializar el componente
    if (this.type == 'password') this.isPassword = true;
  }

  showOrHidePassword() {

    this.hide = !this.hide;

    if (this.hide) this.type = 'password';
    else this.type = 'text';
  }       


} 
