import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestEditQuestionsComponent } from './test-edit-questions.component';

describe('TestEditQuestionsComponent', () => {
  let component: TestEditQuestionsComponent;
  let fixture: ComponentFixture<TestEditQuestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestEditQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestEditQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
