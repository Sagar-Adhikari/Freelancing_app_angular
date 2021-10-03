import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewpreviewComponent } from './viewpreview.component';

describe('ViewpreviewComponent', () => {
  let component: ViewpreviewComponent;
  let fixture: ComponentFixture<ViewpreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewpreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewpreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
