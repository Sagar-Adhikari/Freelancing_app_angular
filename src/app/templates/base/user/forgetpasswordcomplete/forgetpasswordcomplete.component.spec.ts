import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgetpasswordcompleteComponent } from './forgetpasswordcomplete.component';

describe('ForgetpasswordcompleteComponent', () => {
  let component: ForgetpasswordcompleteComponent;
  let fixture: ComponentFixture<ForgetpasswordcompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgetpasswordcompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgetpasswordcompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
