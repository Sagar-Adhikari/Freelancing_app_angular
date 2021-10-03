import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestquestionComponent } from './suggestquestion.component';

describe('SuggestquestionComponent', () => {
  let component: SuggestquestionComponent;
  let fixture: ComponentFixture<SuggestquestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuggestquestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestquestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
