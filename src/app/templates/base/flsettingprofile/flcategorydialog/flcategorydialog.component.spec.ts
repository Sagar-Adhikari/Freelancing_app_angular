import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlcategorydialogComponent } from './flcategorydialog.component';

describe('FlcategorydialogComponent', () => {
  let component: FlcategorydialogComponent;
  let fixture: ComponentFixture<FlcategorydialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlcategorydialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlcategorydialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
