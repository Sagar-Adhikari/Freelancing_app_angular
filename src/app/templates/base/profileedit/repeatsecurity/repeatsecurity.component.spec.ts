import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepeatsecurityComponent } from './repeatsecurity.component';

describe('RepeatsecurityComponent', () => {
  let component: RepeatsecurityComponent;
  let fixture: ComponentFixture<RepeatsecurityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepeatsecurityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepeatsecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
