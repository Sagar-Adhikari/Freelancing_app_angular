import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FldescpdialogComponent } from './fldescpdialog.component';

describe('FldescpdialogComponent', () => {
  let component: FldescpdialogComponent;
  let fixture: ComponentFixture<FldescpdialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FldescpdialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FldescpdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
