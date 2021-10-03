import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawProposalComponent } from './withdraw-proposal.component';

describe('WithdrawProposalComponent', () => {
  let component: WithdrawProposalComponent;
  let fixture: ComponentFixture<WithdrawProposalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WithdrawProposalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
