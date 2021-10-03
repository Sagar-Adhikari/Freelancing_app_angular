import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchfreelancerComponent } from './searchfreelancer.component';

describe('SearchfreelancerComponent', () => {
  let component: SearchfreelancerComponent;
  let fixture: ComponentFixture<SearchfreelancerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchfreelancerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchfreelancerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
