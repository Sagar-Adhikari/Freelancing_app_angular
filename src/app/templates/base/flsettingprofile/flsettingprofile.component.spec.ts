import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlsettingprofileComponent } from './flsettingprofile.component';

describe('FlsettingprofileComponent', () => {
  let component: FlsettingprofileComponent;
  let fixture: ComponentFixture<FlsettingprofileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlsettingprofileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlsettingprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
