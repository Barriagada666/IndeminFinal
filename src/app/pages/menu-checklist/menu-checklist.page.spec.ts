import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuChecklistPage } from './menu-checklist.page';

describe('MenuChecklistPage', () => {
  let component: MenuChecklistPage;
  let fixture: ComponentFixture<MenuChecklistPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuChecklistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
