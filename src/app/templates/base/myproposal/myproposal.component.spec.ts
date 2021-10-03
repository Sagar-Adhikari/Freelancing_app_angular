import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyproposalComponent } from './myproposal.component';

describe('MyproposalComponent', () => {
  let component: MyproposalComponent;
  let fixture: ComponentFixture<MyproposalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyproposalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyproposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
