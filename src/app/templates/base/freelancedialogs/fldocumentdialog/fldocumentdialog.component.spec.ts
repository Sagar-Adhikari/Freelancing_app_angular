import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FldocumentdialogComponent } from './fldocumentdialog.component';

describe('FldocumentdialogComponent', () => {
  let component: FldocumentdialogComponent;
  let fixture: ComponentFixture<FldocumentdialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FldocumentdialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FldocumentdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
