import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestAddCategoriesComponent } from './test-add-categories.component';

describe('TestAddCategoriesComponent', () => {
  let component: TestAddCategoriesComponent;
  let fixture: ComponentFixture<TestAddCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestAddCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAddCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
