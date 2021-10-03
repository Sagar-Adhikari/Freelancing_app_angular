import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MystatusComponent } from './mystatus.component';

describe('MystatusComponent', () => {
  let component: MystatusComponent;
  let fixture: ComponentFixture<MystatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MystatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MystatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
