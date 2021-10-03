import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlportdialogComponent } from './flportdialog.component';

describe('FlportdialogComponent', () => {
  let component: FlportdialogComponent;
  let fixture: ComponentFixture<FlportdialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlportdialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlportdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
