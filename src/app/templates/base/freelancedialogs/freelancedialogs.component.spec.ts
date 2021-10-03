import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreelancedialogsComponent } from './freelancedialogs.component';

describe('FreelancedialogsComponent', () => {
  let component: FreelancedialogsComponent;
  let fixture: ComponentFixture<FreelancedialogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreelancedialogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreelancedialogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
