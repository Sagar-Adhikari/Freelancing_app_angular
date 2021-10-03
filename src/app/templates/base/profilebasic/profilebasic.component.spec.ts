import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilebasicComponent } from './profilebasic.component';

describe('ProfilebasicComponent', () => {
  let component: ProfilebasicComponent;
  let fixture: ComponentFixture<ProfilebasicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilebasicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilebasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
