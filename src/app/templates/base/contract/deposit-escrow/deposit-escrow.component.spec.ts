import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositEscrowComponent } from './deposit-escrow.component';

describe('DepositEscrowComponent', () => {
  let component: DepositEscrowComponent;
  let fixture: ComponentFixture<DepositEscrowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepositEscrowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositEscrowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
