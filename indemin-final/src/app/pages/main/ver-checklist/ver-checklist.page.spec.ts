import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerChecklistPage } from './ver-checklist.page';

describe('VerChecklistPage', () => {
  let component: VerChecklistPage;
  let fixture: ComponentFixture<VerChecklistPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VerChecklistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
