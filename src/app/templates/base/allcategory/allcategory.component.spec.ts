import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllcategoryComponent } from './allcategory.component';

describe('AllcategoryComponent', () => {
  let component: AllcategoryComponent;
  let fixture: ComponentFixture<AllcategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllcategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
