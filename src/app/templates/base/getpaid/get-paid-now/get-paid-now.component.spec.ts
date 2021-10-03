import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetPaidNowComponent } from './get-paid-now.component';

describe('GetPaidNowComponent', () => {
  let component: GetPaidNowComponent;
  let fixture: ComponentFixture<GetPaidNowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetPaidNowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetPaidNowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
