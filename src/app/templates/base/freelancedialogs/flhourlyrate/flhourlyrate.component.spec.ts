import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlhourlyrateComponent } from './flhourlyrate.component';

describe('FlhourlyrateComponent', () => {
  let component: FlhourlyrateComponent;
  let fixture: ComponentFixture<FlhourlyrateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlhourlyrateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlhourlyrateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
