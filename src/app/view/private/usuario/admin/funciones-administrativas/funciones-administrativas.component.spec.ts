import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuncionesAdministrativasComponent } from './funciones-administrativas.component';

describe('FuncionesAdministrativasComponent', () => {
  let component: FuncionesAdministrativasComponent;
  let fixture: ComponentFixture<FuncionesAdministrativasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FuncionesAdministrativasComponent]
    });
    fixture = TestBed.createComponent(FuncionesAdministrativasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
