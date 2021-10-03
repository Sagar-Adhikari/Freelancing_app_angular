import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddjobsComponent } from './addjobs.component';

describe('AddjobsComponent', () => {
  let component: AddjobsComponent;
  let fixture: ComponentFixture<AddjobsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddjobsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddjobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
