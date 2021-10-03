import { Component, OnInit, ElementRef, ViewChild, HostListener, Inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title, Meta, DOCUMENT }     from '@angular/platform-browser';

@Component({
  selector: 'app-testimonial-popup',
  templateUrl: './testimonial-popup.component.html',
  styleUrls: ['./testimonial-popup.component.css']
})
export class TestimonialPopupComponent implements OnInit {
  
  public video_url:any;
  @ViewChild('vs_frame') pops:any;

  constructor(@Inject(DOCUMENT) private document: HTMLDocument) {
  }

  ngOnInit() {
  	if(this.video_url!=''){
  		let elem = this.pops.nativeElement as HTMLIFrameElement;
    	elem.src = this.video_url; 
  	}
  }

}
