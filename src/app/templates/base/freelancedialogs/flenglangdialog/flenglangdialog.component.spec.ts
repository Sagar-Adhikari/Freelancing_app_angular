import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlenglangdialogComponent } from './flenglangdialog.component';

describe('FlenglangdialogComponent', () => {
  let component: FlenglangdialogComponent;
  let fixture: ComponentFixture<FlenglangdialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlenglangdialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlenglangdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
