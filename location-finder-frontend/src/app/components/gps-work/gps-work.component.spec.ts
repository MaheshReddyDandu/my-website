import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GpsWorkComponent } from './gps-work.component';

describe('GpsWorkComponent', () => {
  let component: GpsWorkComponent;
  let fixture: ComponentFixture<GpsWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GpsWorkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GpsWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
