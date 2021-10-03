import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlregbasicComponent } from './flregbasic.component';

describe('FlregbasicComponent', () => {
  let component: FlregbasicComponent;
  let fixture: ComponentFixture<FlregbasicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlregbasicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlregbasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
