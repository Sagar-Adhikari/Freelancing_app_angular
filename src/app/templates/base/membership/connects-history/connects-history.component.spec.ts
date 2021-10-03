import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectsHistoryComponent } from './connects-history.component';

describe('ConnectsHistoryComponent', () => {
  let component: ConnectsHistoryComponent;
  let fixture: ComponentFixture<ConnectsHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectsHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectsHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
