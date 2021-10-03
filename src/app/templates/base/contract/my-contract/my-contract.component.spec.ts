import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyContractComponent } from './my-contract.component';

describe('MyContractComponent', () => {
  let component: MyContractComponent;
  let fixture: ComponentFixture<MyContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
