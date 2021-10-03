import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupBankComponent } from './setup-bank.component';

describe('SetupBankComponent', () => {
  let component: SetupBankComponent;
  let fixture: ComponentFixture<SetupBankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupBankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
