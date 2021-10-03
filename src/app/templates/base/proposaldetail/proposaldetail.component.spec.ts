import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposaldetailComponent } from './proposaldetail.component';

describe('ProposaldetailComponent', () => {
  let component: ProposaldetailComponent;
  let fixture: ComponentFixture<ProposaldetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProposaldetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposaldetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
