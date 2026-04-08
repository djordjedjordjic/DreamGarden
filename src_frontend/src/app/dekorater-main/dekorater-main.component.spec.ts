import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DekoraterMainComponent } from './dekorater-main.component';

describe('DekoraterMainComponent', () => {
  let component: DekoraterMainComponent;
  let fixture: ComponentFixture<DekoraterMainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DekoraterMainComponent]
    });
    fixture = TestBed.createComponent(DekoraterMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
