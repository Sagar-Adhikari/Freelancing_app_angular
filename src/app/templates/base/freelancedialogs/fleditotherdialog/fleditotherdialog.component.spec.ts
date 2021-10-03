import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleditotherdialogComponent } from './fleditotherdialog.component';

describe('FleditotherdialogComponent', () => {
  let component: FleditotherdialogComponent;
  let fixture: ComponentFixture<FleditotherdialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FleditotherdialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleditotherdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
