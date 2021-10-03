import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingMethodListComponent } from './billing-method-list.component';

describe('BillingMethodListComponent', () => {
  let component: BillingMethodListComponent;
  let fixture: ComponentFixture<BillingMethodListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingMethodListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingMethodListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
