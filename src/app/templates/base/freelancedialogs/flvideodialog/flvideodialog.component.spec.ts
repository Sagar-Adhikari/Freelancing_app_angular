import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlvideodialogComponent } from './flvideodialog.component';

describe('FlvideodialogComponent', () => {
  let component: FlvideodialogComponent;
  let fixture: ComponentFixture<FlvideodialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlvideodialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlvideodialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
