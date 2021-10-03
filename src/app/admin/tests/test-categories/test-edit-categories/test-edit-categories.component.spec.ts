import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestEditCategoriesComponent } from './test-edit-categories.component';

describe('TestEditCategoriesComponent', () => {
  let component: TestEditCategoriesComponent;
  let fixture: ComponentFixture<TestEditCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestEditCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestEditCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
