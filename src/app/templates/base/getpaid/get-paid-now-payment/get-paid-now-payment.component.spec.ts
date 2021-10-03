import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetPaidNowPaymentComponent } from './get-paid-now-payment.component';

describe('GetPaidNowPaymentComponent', () => {
  let component: GetPaidNowPaymentComponent;
  let fixture: ComponentFixture<GetPaidNowPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetPaidNowPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetPaidNowPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
