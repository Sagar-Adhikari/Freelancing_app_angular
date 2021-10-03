import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FladdlangdialogComponent } from './fladdlangdialog.component';

describe('FladdlangdialogComponent', () => {
  let component: FladdlangdialogComponent;
  let fixture: ComponentFixture<FladdlangdialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FladdlangdialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FladdlangdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
