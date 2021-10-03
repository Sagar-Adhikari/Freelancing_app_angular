import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreelencerviewComponent } from './freelencerview.component';

describe('FreelencerviewComponent', () => {
  let component: FreelencerviewComponent;
  let fixture: ComponentFixture<FreelencerviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreelencerviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreelencerviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
