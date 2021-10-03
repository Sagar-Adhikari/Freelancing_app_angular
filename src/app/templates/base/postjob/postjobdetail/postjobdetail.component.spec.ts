import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostjobdetailComponent } from './postjobdetail.component';

describe('PostjobdetailComponent', () => {
  let component: PostjobdetailComponent;
  let fixture: ComponentFixture<PostjobdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostjobdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostjobdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
