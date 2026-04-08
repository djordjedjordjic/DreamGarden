import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginoComponent } from './logino.component';

describe('LoginoComponent', () => {
  let component: LoginoComponent;
  let fixture: ComponentFixture<LoginoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginoComponent]
    });
    fixture = TestBed.createComponent(LoginoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
