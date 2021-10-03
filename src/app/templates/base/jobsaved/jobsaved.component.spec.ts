import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsavedComponent } from './jobsaved.component';

describe('JobsavedComponent', () => {
  let component: JobsavedComponent;
  let fixture: ComponentFixture<JobsavedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobsavedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsavedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
