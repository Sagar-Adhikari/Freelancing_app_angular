import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { ISlimScrollOptions } from '../../ngx-slimscroll/classes/slimscroll-options.class';
import { SlimScrollState, ISlimScrollState } from '../../ngx-slimscroll/classes/slimscroll-state.class';
import { UserService } from '../../services/sync/user.service';
import { ApiService } from '../../services/api/api.service';
import { constant } from '../../../data/constant';
@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.css']
})
export class SidemenuComponent implements OnInit {
  showSidebar = true;

  searchOpenCheck = false;
  searchOpenCheckTwo = false;
searchFormOpen = '';
searchFormOpenTwo = '';

options: ISlimScrollOptions;
secondOptions: ISlimScrollOptions;
slimScrollState = new SlimScrollState();
count: any = {}
urlData:any;
urlSegment:any;
panelOpenState = false;
siteSettings:any;
logo_url =  constant.siteLogo;
application_name = 'Workplus';
favicon = 'favicon.ico';
currentUrl = "";
  constructor(
    @Inject(DOCUMENT) private document,
    private router: Router,
    private usersService: UserService,
    public apiservice: ApiService,
    private titleService: Title
  ) {
    this.options = {
      barBackground: '#8e8e8e',
      position: 'right',
      barOpacity: '0.7',
      barMargin: '0',
      gridOpacity: '1',
      gridBorderRadius: '20',
      gridMargin: '0',
      gridBackground: '#262d37',
      barBorderRadius: '10',
      barWidth: '6',
      gridWidth: '0',
      alwaysVisible: true
    };
   }

  ngOnInit() {
    this.currentUrl = this.router.url;
    this.urlData = this.router.url.split('/');
    this.urlSegment = this.urlData[1]+'/'+this.urlData[2]+'/'+this.urlData[3];
    this.getSiteSettings();
  }
  getSiteSettings() {
    const siteLogo = localStorage.getItem('workplus_logo');
    if (siteLogo != "" && typeof siteLogo != 'undefined' && siteLogo != null && siteLogo != 'null') {
      this.logo_url = siteLogo;
      this.application_name = localStorage.getItem('workplus_appname');
      this.titleService.setTitle( this.application_name );
      this.favicon = localStorage.getItem('workplus_favicon');
      this.document.getElementById('appFavicon').setAttribute('href', this.favicon);
    } else {
      const getSiteDetailsUrl = constant.apiurl + constant.adminSettingsOptions;
      this.apiservice.getRequest(getSiteDetailsUrl).subscribe(
        result => {
          this.siteSettings = result;
          if (this.siteSettings.status === 200 && this.siteSettings.ok === true) {
            if (typeof this.siteSettings.body.options.frontend_logo != 'undefined') {
              this.logo_url = constant.imgurl + this.siteSettings.body.options.frontend_logo;
              localStorage.setItem('workplus_logo', constant.imgurl + this.siteSettings.body.options.frontend_logo);
            }
            if (typeof this.siteSettings.body.options.application_name != 'undefined') {
              this.application_name = this.siteSettings.body.options.application_name;
              this.titleService.setTitle( this.siteSettings.body.options.application_name );
              localStorage.setItem('workplus_appname', this.siteSettings.body.options.application_name);
            }
            if (typeof this.siteSettings.body.options.fav_icons != 'undefined') {
              localStorage.setItem('workplus_favicon', constant.imgurl + this.siteSettings.body.options.fav_icons);
              this.document.getElementById('appFavicon').setAttribute('href', constant.imgurl + this.siteSettings.body.options.fav_icons);
            }
          }
        });
    }
  }
  scrollChanged($event: ISlimScrollState) {
    this.slimScrollState = $event;
  }

onSearchToggleButton(toggleValue) {
 this.searchOpenCheck = toggleValue == false ? true : false;
 this.searchFormOpen = this.searchOpenCheck == true ? 'active' : '';
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
