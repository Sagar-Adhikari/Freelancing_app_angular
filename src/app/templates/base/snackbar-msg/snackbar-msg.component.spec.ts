import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackbarMsgComponent } from './snackbar-msg.component';

describe('SnackbarMsgComponent', () => {
  let component: SnackbarMsgComponent;
  let fixture: ComponentFixture<SnackbarMsgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnackbarMsgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnackbarMsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
