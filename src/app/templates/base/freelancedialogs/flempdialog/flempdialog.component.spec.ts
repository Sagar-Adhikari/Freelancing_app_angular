import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlempdialogComponent } from './flempdialog.component';

describe('FlempdialogComponent', () => {
  let component: FlempdialogComponent;
  let fixture: ComponentFixture<FlempdialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlempdialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlempdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
