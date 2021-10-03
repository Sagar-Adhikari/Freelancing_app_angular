import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientproposalComponent } from './clientproposal.component';

describe('ClientproposalComponent', () => {
  let component: ClientproposalComponent;
  let fixture: ComponentFixture<ClientproposalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientproposalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientproposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
