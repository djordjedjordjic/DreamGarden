import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VlasnikZakazivanjeFirmaComponent } from './vlasnik-zakazivanje-firma.component';

describe('VlasnikZakazivanjeFirmaComponent', () => {
  let component: VlasnikZakazivanjeFirmaComponent;
  let fixture: ComponentFixture<VlasnikZakazivanjeFirmaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VlasnikZakazivanjeFirmaComponent]
    });
    fixture = TestBed.createComponent(VlasnikZakazivanjeFirmaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
