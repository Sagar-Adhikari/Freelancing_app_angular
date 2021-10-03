import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlskilldialogComponent } from './flskilldialog.component';

describe('FlskilldialogComponent', () => {
  let component: FlskilldialogComponent;
  let fixture: ComponentFixture<FlskilldialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlskilldialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlskilldialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
