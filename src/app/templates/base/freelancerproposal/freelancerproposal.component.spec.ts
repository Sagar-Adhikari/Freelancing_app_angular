import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreelancerproposalComponent } from './freelancerproposal.component';

describe('FreelancerproposalComponent', () => {
  let component: FreelancerproposalComponent;
  let fixture: ComponentFixture<FreelancerproposalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreelancerproposalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreelancerproposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
