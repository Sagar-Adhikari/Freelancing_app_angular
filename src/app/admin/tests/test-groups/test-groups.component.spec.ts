import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestGroupsComponent } from './test-groups.component';

describe('TestGroupsComponent', () => {
  let component: TestGroupsComponent;
  let fixture: ComponentFixture<TestGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
