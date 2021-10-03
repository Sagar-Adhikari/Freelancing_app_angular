import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlavailabledialogComponent } from './flavailabledialog.component';

describe('FlavailabledialogComponent', () => {
  let component: FlavailabledialogComponent;
  let fixture: ComponentFixture<FlavailabledialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlavailabledialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlavailabledialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
