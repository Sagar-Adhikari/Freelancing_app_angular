import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailProposalComponent } from './detail-proposal.component';

describe('DetailProposalComponent', () => {
  let component: DetailProposalComponent;
  let fixture: ComponentFixture<DetailProposalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailProposalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
