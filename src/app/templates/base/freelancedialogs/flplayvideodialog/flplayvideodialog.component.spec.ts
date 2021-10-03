import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlplayvideodialogComponent } from './flplayvideodialog.component';

describe('FlplayvideodialogComponent', () => {
  let component: FlplayvideodialogComponent;
  let fixture: ComponentFixture<FlplayvideodialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlplayvideodialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlplayvideodialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
