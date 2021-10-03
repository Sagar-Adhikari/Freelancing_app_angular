import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestimonialPopupComponent } from './testimonial-popup.component';

describe('TestimonialPopupComponent', () => {
  let component: TestimonialPopupComponent;
  let fixture: ComponentFixture<TestimonialPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestimonialPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestimonialPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
