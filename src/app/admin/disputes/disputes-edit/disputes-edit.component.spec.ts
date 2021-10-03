import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisputesEditComponent } from './disputes-edit.component';

describe('DisputesEditComponent', () => {
  let component: DisputesEditComponent;
  let fixture: ComponentFixture<DisputesEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisputesEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisputesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
