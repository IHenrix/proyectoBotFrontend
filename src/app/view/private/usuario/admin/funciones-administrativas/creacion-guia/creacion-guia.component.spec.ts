import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreacionGuiaComponent } from './creacion-guia.component';

describe('CreacionGuiaComponent', () => {
  let component: CreacionGuiaComponent;
  let fixture: ComponentFixture<CreacionGuiaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreacionGuiaComponent]
    });
    fixture = TestBed.createComponent(CreacionGuiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
