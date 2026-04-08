import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NrIzgledComponent } from './nr-izgled.component';

describe('NrIzgledComponent', () => {
  let component: NrIzgledComponent;
  let fixture: ComponentFixture<NrIzgledComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NrIzgledComponent]
    });
    fixture = TestBed.createComponent(NrIzgledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
