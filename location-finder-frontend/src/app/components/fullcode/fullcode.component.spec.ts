import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullcodeComponent } from './fullcode.component';

describe('FullcodeComponent', () => {
  let component: FullcodeComponent;
  let fixture: ComponentFixture<FullcodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FullcodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
