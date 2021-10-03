import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatelistComponent } from './candidatelist.component';

describe('CandidatelistComponent', () => {
  let component: CandidatelistComponent;
  let fixture: ComponentFixture<CandidatelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidatelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidatelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
