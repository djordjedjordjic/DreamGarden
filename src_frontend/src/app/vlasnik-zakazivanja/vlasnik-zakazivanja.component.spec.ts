import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VlasnikZakazivanjaComponent } from './vlasnik-zakazivanja.component';

describe('VlasnikZakazivanjaComponent', () => {
  let component: VlasnikZakazivanjaComponent;
  let fixture: ComponentFixture<VlasnikZakazivanjaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VlasnikZakazivanjaComponent]
    });
    fixture = TestBed.createComponent(VlasnikZakazivanjaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
