import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DekoraterStatistikaComponent } from './dekorater-statistika.component';

describe('DekoraterStatistikaComponent', () => {
  let component: DekoraterStatistikaComponent;
  let fixture: ComponentFixture<DekoraterStatistikaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DekoraterStatistikaComponent]
    });
    fixture = TestBed.createComponent(DekoraterStatistikaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
