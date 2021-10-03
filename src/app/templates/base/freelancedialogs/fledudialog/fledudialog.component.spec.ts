import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FledudialogComponent } from './fledudialog.component';

describe('FledudialogComponent', () => {
  let component: FledudialogComponent;
  let fixture: ComponentFixture<FledudialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FledudialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FledudialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
