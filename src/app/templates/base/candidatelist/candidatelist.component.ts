import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-candidatelist',
  templateUrl: './candidatelist.component.html',
  styleUrls: ['./candidatelist.component.css']
})
export class CandidatelistComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  panelOpenState: boolean = false;

}
