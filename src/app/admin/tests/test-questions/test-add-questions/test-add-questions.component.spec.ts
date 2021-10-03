import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestAddQuestionsComponent } from './test-add-questions.component';

describe('TestAddQuestionsComponent', () => {
  let component: TestAddQuestionsComponent;
  let fixture: ComponentFixture<TestAddQuestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestAddQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAddQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
