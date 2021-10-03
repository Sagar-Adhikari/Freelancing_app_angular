import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreelancerFeedbackComponent } from './freelancer-feedback.component';

describe('FreelancerFeedbackComponent', () => {
  let component: FreelancerFeedbackComponent;
  let fixture: ComponentFixture<FreelancerFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreelancerFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreelancerFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
