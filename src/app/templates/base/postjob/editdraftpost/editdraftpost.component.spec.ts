import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditdraftpostComponent } from './editdraftpost.component';

describe('EditdraftpostComponent', () => {
  let component: EditdraftpostComponent;
  let fixture: ComponentFixture<EditdraftpostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditdraftpostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditdraftpostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
