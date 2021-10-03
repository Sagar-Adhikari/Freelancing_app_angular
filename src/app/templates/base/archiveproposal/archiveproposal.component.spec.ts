import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveproposalComponent } from './archiveproposal.component';

describe('ArchiveproposalComponent', () => {
  let component: ArchiveproposalComponent;
  let fixture: ComponentFixture<ArchiveproposalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchiveproposalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchiveproposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
