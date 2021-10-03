import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmspageComponent } from './cmspage.component';

describe('CmspageComponent', () => {
  let component: CmspageComponent;
  let fixture: ComponentFixture<CmspageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmspageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmspageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
