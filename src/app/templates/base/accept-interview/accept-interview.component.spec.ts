import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptInterviewComponent } from './accept-interview.component';

describe('AcceptInterviewComponent', () => {
  let component: AcceptInterviewComponent;
  let fixture: ComponentFixture<AcceptInterviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcceptInterviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
