import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteBillingMethodComponent } from './delete-billing-method.component';

describe('DeleteBillingMethodComponent', () => {
  let component: DeleteBillingMethodComponent;
  let fixture: ComponentFixture<DeleteBillingMethodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteBillingMethodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteBillingMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
