import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlotherexpdialogComponent } from './flotherexpdialog.component';

describe('FlotherexpdialogComponent', () => {
  let component: FlotherexpdialogComponent;
  let fixture: ComponentFixture<FlotherexpdialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlotherexpdialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlotherexpdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
