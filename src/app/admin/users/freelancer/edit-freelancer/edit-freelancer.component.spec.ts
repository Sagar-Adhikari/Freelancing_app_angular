import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFreelancerComponent } from './edit-freelancer.component';

describe('EditFreelancerComponent', () => {
  let component: EditFreelancerComponent;
  let fixture: ComponentFixture<EditFreelancerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditFreelancerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFreelancerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
