import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HtmltestquestionsComponent } from './htmltestquestions.component';

describe('HtmltestquestionsComponent', () => {
  let component: HtmltestquestionsComponent;
  let fixture: ComponentFixture<HtmltestquestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HtmltestquestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HtmltestquestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
