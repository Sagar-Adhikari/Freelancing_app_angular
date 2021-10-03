import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestAddGroupsComponent } from './test-add-groups.component';

describe('TestAddGroupsComponent', () => {
  let component: TestAddGroupsComponent;
  let fixture: ComponentFixture<TestAddGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestAddGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAddGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
