import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSuggestedQuestionComponent } from './add-suggested-question.component';

describe('AddSuggestedQuestionComponent', () => {
  let component: AddSuggestedQuestionComponent;
  let fixture: ComponentFixture<AddSuggestedQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSuggestedQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSuggestedQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
