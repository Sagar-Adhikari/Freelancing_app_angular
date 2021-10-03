import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSecurityQuestionComponent } from './add-security-question.component';

describe('AddSecurityQuestionComponent', () => {
  let component: AddSecurityQuestionComponent;
  let fixture: ComponentFixture<AddSecurityQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSecurityQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSecurityQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
