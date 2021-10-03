import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlregmoredetailsComponent } from './flregmoredetails.component';

describe('FlregmoredetailsComponent', () => {
  let component: FlregmoredetailsComponent;
  let fixture: ComponentFixture<FlregmoredetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlregmoredetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlregmoredetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
