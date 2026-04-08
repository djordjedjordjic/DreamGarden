import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DekoraterOdrzavanjeComponent } from './dekorater-odrzavanje.component';

describe('DekoraterOdrzavanjeComponent', () => {
  let component: DekoraterOdrzavanjeComponent;
  let fixture: ComponentFixture<DekoraterOdrzavanjeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DekoraterOdrzavanjeComponent]
    });
    fixture = TestBed.createComponent(DekoraterOdrzavanjeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
