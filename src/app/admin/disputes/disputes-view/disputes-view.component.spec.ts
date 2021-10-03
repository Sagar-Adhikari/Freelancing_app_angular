import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisputesViewComponent } from './disputes-view.component';

describe('DisputesViewComponent', () => {
  let component: DisputesViewComponent;
  let fixture: ComponentFixture<DisputesViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisputesViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisputesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
