import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovaSifraComponent } from './nova-sifra.component';

describe('NovaSifraComponent', () => {
  let component: NovaSifraComponent;
  let fixture: ComponentFixture<NovaSifraComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NovaSifraComponent]
    });
    fixture = TestBed.createComponent(NovaSifraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
