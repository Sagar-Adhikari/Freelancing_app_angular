import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawSettlementComponent } from './withdraw-settlement.component';

describe('WithdrawSettlementComponent', () => {
  let component: WithdrawSettlementComponent;
  let fixture: ComponentFixture<WithdrawSettlementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WithdrawSettlementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawSettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
