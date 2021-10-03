import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReusepostComponent } from './reusepost.component';

describe('ReusepostComponent', () => {
  let component: ReusepostComponent;
  let fixture: ComponentFixture<ReusepostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReusepostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReusepostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
