import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
declare var jQuery;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public shouldShow = false;

  constructor(@Inject(DOCUMENT) private document: Document) { }


  ngOnInit(){
 }

 toggleSidebar(e) {
  e.preventDefault();
  this.shouldShow = !this.shouldShow;
    if(this.shouldShow)
  {
  this.document.body.classList.add('show-sidebar');
  this.document.body.classList.remove('hide-sidebar');
  } else {
    this.document.body.classList.add('hide-sidebar');
    this.document.body.classList.remove('show-sidebar');
  }
 }




}
