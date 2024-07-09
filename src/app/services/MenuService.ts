import { Injectable } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private menuController: MenuController) { }

  openMainMenu() {
    this.menuController.open('main-menu');
  }

  closeMainMenu() {
    this.menuController.close('main-menu');
  }
}
