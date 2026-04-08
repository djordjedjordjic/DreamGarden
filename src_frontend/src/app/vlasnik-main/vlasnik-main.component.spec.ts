import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VlasnikMainComponent } from './vlasnik-main.component';

describe('VlasnikMainComponent', () => {
  let component: VlasnikMainComponent;
  let fixture: ComponentFixture<VlasnikMainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VlasnikMainComponent]
    });
    fixture = TestBed.createComponent(VlasnikMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
