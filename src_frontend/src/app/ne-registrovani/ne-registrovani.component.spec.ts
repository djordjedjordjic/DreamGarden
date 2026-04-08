import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeRegistrovaniComponent } from './ne-registrovani.component';

describe('NeRegistrovaniComponent', () => {
  let component: NeRegistrovaniComponent;
  let fixture: ComponentFixture<NeRegistrovaniComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NeRegistrovaniComponent]
    });
    fixture = TestBed.createComponent(NeRegistrovaniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
