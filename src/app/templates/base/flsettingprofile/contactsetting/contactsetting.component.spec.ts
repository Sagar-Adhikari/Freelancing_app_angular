import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsettingComponent } from './contactsetting.component';

describe('ContactsettingComponent', () => {
  let component: ContactsettingComponent;
  let fixture: ComponentFixture<ContactsettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactsettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
