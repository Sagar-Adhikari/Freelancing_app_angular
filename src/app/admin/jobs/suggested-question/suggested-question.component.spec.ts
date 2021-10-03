import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestedQuestionComponent } from './suggested-question.component';

describe('SuggestedQuestionComponent', () => {
  let component: SuggestedQuestionComponent;
  let fixture: ComponentFixture<SuggestedQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuggestedQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestedQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
