import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimePaymentsComponent } from './time-payments.component';

describe('TimePaymentsComponent', () => {
  let component: TimePaymentsComponent;
  let fixture: ComponentFixture<TimePaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimePaymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimePaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
