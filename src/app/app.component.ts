import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  constructor(
    private router: Router
  ) {
    (<any>window).ga('create', environment.googleAnalyticsTrackingId, 'auto');
    this.router.routeReuseStrategy.shouldReuseRoute = function(){
      return false;
   };
   this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
         this.router.navigated = false;
         window.scrollTo(0, 0);
      }
  });
  }

  ngOnInit() {
    
  }

}
