import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearcheditdialogComponent } from './searcheditdialog.component';

describe('SearcheditdialogComponent', () => {
  let component: SearcheditdialogComponent;
  let fixture: ComponentFixture<SearcheditdialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearcheditdialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearcheditdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
