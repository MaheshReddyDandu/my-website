import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalContextComponent } from './historical-context.component';

describe('HistoricalContextComponent', () => {
  let component: HistoricalContextComponent;
  let fixture: ComponentFixture<HistoricalContextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoricalContextComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoricalContextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
