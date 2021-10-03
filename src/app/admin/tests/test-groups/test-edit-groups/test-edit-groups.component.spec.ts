import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestEditGroupsComponent } from './test-edit-groups.component';

describe('TestEditGroupsComponent', () => {
  let component: TestEditGroupsComponent;
  let fixture: ComponentFixture<TestEditGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestEditGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestEditGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
