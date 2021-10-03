import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHomeSettingsComponent } from './edit-home-settings.component';

describe('EditHomeSettingsComponent', () => {
  let component: EditHomeSettingsComponent;
  let fixture: ComponentFixture<EditHomeSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditHomeSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditHomeSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
