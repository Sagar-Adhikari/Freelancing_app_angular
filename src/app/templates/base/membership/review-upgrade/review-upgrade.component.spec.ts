import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewUpgradeComponent } from './review-upgrade.component';

describe('ReviewUpgradeComponent', () => {
  let component: ReviewUpgradeComponent;
  let fixture: ComponentFixture<ReviewUpgradeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewUpgradeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewUpgradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
