import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlTransactionsComponent } from './fl-transactions.component';

describe('FlTransactionsComponent', () => {
  let component: FlTransactionsComponent;
  let fixture: ComponentFixture<FlTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
