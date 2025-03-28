import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReverseGeolocationComponent } from './reverse-geolocation.component';

describe('ReverseGeolocationComponent', () => {
  let component: ReverseGeolocationComponent;
  let fixture: ComponentFixture<ReverseGeolocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReverseGeolocationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReverseGeolocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
