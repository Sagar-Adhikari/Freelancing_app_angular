import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminConnectsComponent } from './admin-connects.component';

describe('AdminConnectsComponent', () => {
  let component: AdminConnectsComponent;
  let fixture: ComponentFixture<AdminConnectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminConnectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminConnectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
