import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { UpdateChecklistModalComponent } from './update-checklist-modal.component'; // Asegúrate de que la ruta al componente sea correcta

describe('UpdateChecklistModalComponent', () => {
  let component: UpdateChecklistModalComponent;
  let fixture: ComponentFixture<UpdateChecklistModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateChecklistModalComponent],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateChecklistModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
