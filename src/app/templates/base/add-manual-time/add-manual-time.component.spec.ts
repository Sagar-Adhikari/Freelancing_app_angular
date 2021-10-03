import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddManualTimeComponent } from './add-manual-time.component';

describe('AddManualTimeComponent', () => {
  let component: AddManualTimeComponent;
  let fixture: ComponentFixture<AddManualTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddManualTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddManualTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
