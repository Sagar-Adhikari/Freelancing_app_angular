import { Component, ChangeDetectorRef, OnInit, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UserService } from './../services/sync/user.service';
import { MatSnackBar } from '@angular/material';

import { ISlimScrollOptions } from '../ngx-slimscroll/classes/slimscroll-options.class';
import { SlimScrollEvent } from '../ngx-slimscroll/classes/slimscroll-event.class';
import { SlimScrollState, ISlimScrollState } from '../ngx-slimscroll/classes/slimscroll-state.class';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  options: ISlimScrollOptions;
  secondOptions: ISlimScrollOptions;
  slimScrollState = new SlimScrollState();
  searchFormOpen = "";
  innerHeight: any;
  DropdownVar = 0;
  constructor(
    private sanitizer:DomSanitizer, 
    private router:Router, 
    private usersService:UserService, 
    public snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  )
  
  {
    this.options = {
      barBackground: '#fcfcfc',
      gridBackground: '#f8f8f8',
      barBorderRadius: '10',
      barWidth: '6',
      gridWidth: '2',
      alwaysVisible: true
    };

    this.innerHeight = sanitizer.bypassSecurityTrustStyle((window.innerHeight) + "px");

    this.usersService.globalAlert.subscribe(alertMessage => {
      if (alertMessage.length > 0) {
        this.snackBar.open(alertMessage, '', {
          duration: 3000,
        });
      }
    });
   }

   scrollChanged($event: ISlimScrollState) {
    this.slimScrollState = $event;
  }

  ngOnInit() {
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  logout() {
    localStorage.removeItem('workplus_token');
    localStorage.removeItem('live_broadcasts');
    localStorage.removeItem('workplus_logo');
    localStorage.removeItem('workplus_appname');
    localStorage.removeItem('workplus_favicon');
    this.usersService.userlogin('guest');
    this.router.navigate(['/']);
   }

}
