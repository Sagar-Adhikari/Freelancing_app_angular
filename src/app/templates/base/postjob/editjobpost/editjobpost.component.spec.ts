import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditjobpostComponent } from './editjobpost.component';

describe('EditjobpostComponent', () => {
  let component: EditjobpostComponent;
  let fixture: ComponentFixture<EditjobpostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditjobpostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditjobpostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
