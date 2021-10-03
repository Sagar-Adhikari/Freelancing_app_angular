import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HtmltestComponent } from './htmltest.component';

describe('HtmltestComponent', () => {
  let component: HtmltestComponent;
  let fixture: ComponentFixture<HtmltestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HtmltestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HtmltestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
