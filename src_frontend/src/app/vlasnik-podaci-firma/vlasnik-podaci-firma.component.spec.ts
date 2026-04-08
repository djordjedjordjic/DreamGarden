import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VlasnikPodaciFirmaComponent } from './vlasnik-podaci-firma.component';

describe('VlasnikPodaciFirmaComponent', () => {
  let component: VlasnikPodaciFirmaComponent;
  let fixture: ComponentFixture<VlasnikPodaciFirmaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VlasnikPodaciFirmaComponent]
    });
    fixture = TestBed.createComponent(VlasnikPodaciFirmaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
