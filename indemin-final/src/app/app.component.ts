import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  constructor(
    private router: Router,
    private menu: MenuController
  ) {}


  async closeMenu() {
    if (await this.menu.isOpen('main-menu')) {
      this.menu.close('main-menu');
    }
  }
}
