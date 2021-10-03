import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestcategorylistComponent } from './testcategorylist.component';

describe('TestcategorylistComponent', () => {
  let component: TestcategorylistComponent;
  let fixture: ComponentFixture<TestcategorylistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestcategorylistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestcategorylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
