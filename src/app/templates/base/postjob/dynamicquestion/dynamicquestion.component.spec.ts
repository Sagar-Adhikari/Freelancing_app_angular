import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicquestionComponent } from './dynamicquestion.component';

describe('DynamicquestionComponent', () => {
  let component: DynamicquestionComponent;
  let fixture: ComponentFixture<DynamicquestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicquestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicquestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
