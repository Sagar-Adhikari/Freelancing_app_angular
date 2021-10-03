import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteFreelencerComponent } from './invite-freelencer.component';

describe('InviteFreelencerComponent', () => {
  let component: InviteFreelencerComponent;
  let fixture: ComponentFixture<InviteFreelencerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteFreelencerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteFreelencerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
