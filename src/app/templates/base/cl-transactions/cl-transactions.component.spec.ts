import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClTransactionsComponent } from './cl-transactions.component';

describe('ClTransactionsComponent', () => {
  let component: ClTransactionsComponent;
  let fixture: ComponentFixture<ClTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
