import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupPaypalComponent } from './setup-paypal.component';

describe('SetupPaypalComponent', () => {
  let component: SetupPaypalComponent;
  let fixture: ComponentFixture<SetupPaypalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupPaypalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupPaypalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
