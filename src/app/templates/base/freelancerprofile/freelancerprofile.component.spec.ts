import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreelancerprofileComponent } from './freelancerprofile.component';

describe('FreelancerprofileComponent', () => {
  let component: FreelancerprofileComponent;
  let fixture: ComponentFixture<FreelancerprofileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreelancerprofileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreelancerprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
