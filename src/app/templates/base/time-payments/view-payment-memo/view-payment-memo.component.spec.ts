import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPaymentMemoComponent } from './view-payment-memo.component';

describe('ViewPaymentMemoComponent', () => {
  let component: ViewPaymentMemoComponent;
  let fixture: ComponentFixture<ViewPaymentMemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPaymentMemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPaymentMemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
