import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalMonthViewComponent } from './cal-month-view.component';

describe('CalMonthViewComponent', () => {
  let component: CalMonthViewComponent;
  let fixture: ComponentFixture<CalMonthViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalMonthViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalMonthViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
