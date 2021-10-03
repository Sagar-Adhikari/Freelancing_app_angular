import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSuggestedQuestionComponent } from './edit-suggested-question.component';

describe('EditSuggestedQuestionComponent', () => {
  let component: EditSuggestedQuestionComponent;
  let fixture: ComponentFixture<EditSuggestedQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSuggestedQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSuggestedQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
