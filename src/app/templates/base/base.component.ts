import { Component, ChangeDetectorRef, Inject, ViewChild, ElementRef, Input, HostListener } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, RoutesRecognized } from '@angular/router';
import { Title, Meta, DOCUMENT } from '@angular/platform-browser';
import { MatDialog, MatDialogRef, DialogPosition } from '@angular/material';
import { environment } from './../../../environments/environment';
import 'rxjs/add/operator/filter';
import { UserService } from './../../services/sync/user.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { ApiService } from '../../services/api/api.service';
import { constant } from '../../../data/constant';
import { Observable } from 'rxjs/Observable';
import { Setting } from '../../../model/setting';
import { FooterComponent } from './footer/footer.component';
import { AuthService } from '../../services/auth/auth.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { NotificationPopupComponent } from './notification-popup/notification-popup.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseComponent {

  public show:boolean = true;
  public buttonName:any = 'Hide';
  title = 'app';
  isGuest = true;
  userid = '';
  username = '';
  userimg = '';
  loggedclass = '';
  roles = '';
  isLayout1 = true;
  isLayout2: boolean;
  search_text = '';
  broadcast_count = '0';
  follower_count = '0';
  following_count = '0';
  unseen_count = 0;
  group_count = '0';
  profile_first_name = '';
  profile_last_name = '';
  result: any;
  profile_pic: any;
  querystring = '';
  profilename: any;
  isowner = false;
  isadmin = false;
  issearch = 1;
  is_follow = false;
  is_requested = false;
  is_block = false;
  follow_status = true;
  isloader = false;
  profileid = '';
  is_follow_button = false;
  searchplaceholder = 'Find Broadcast';
  searchicon = 'live_tv';
  isPrivate = false;
  unread_count = 0;
  current_year: number = new Date().getFullYear();
  public setting: Setting;
  is_pg_class = '';
  is_home = false;
  postjoburl = '/postjob';
  loginusername: string;
  availableConnects: any = 0;
  queryUserID: string;
  profileDetails: any;
  userType: string;
  profileHeaderImage;
  withoutloginpage = ['/', '/login', '/register', '/forgetpwd','resendlink'];
  commonProfile = '';
  activeUrl = '';
  image_url = constant.imgurl;
  @ViewChild('searchby') searchBy: ElementRef;
  searchByChange = 'Freelancer';
  searchPlaceholder = 'Freelancer';
  searchByIcon = 'people';
  searchByValue = '';
  onlineStatus = '';
  resUserData: any;
  siteSettings: any = [];
  logo_url = constant.siteLogo;
  application_name = 'RemoteNepal';
  favicon = 'favicon.ico';
  created: any;
  searchByuser:any;
  searchJobByuser:any;
  zone: any;  
  configSuccess: MatSnackBarConfig = {
    panelClass: 'custom-class',
    duration: 2000,
    horizontalPosition: 'center',
    verticalPosition: 'top'
  };
  notifyPopupDialogRef: MatDialogRef<NotificationPopupComponent>;
  loggedInType:string;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private metaService: Meta,
    private usersService: UserService,
    public snackBar: MatSnackBar,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    public auth: AuthService,
    public toastr: ToastrManager,
    @Inject(DOCUMENT) private document: HTMLDocument
  ) {
    router.events
      .filter(e => e instanceof NavigationEnd)
      .forEach(e => {
        if (route.root.firstChild.snapshot.data && route.root.firstChild.snapshot.data['layout']) {
          this.usersService.sendHeaderLayout(route.root.firstChild.snapshot.data['layout']);
        }
      });
  }
  freelancerlist(event){
    localStorage.setItem('freelancerview',event);
  }
  keyDownFunction(event) {
    if(event.keyCode == 13) {
      this.searchByValue = this.searchBy.nativeElement.value;
      if (this.searchByChange == 'Freelancer') {
        localStorage.setItem('search_by', this.searchByValue);
        this.router.navigate(['/search/freelancer']);
      } else if (this.searchByChange == 'Job') {
        localStorage.setItem('search_by', this.searchByValue);
        this.router.navigate(['/search/job']);
      }
    }
  }

  displayFooter(): boolean {    
    var displayFooter = !window.location.href.includes('chat-room');
    if(!displayFooter) {      
      var work_homewrap_main = document.getElementById('home_wrapper_main');
      work_homewrap_main.classList.remove('work_homewrap_w_padding');
    } else {
      var work_homewrap_main = document.getElementById('home_wrapper_main');
      work_homewrap_main.classList.add('work_homewrap_w_padding');
    }
    return displayFooter;
  }
  
  ngOnInit() {

    this.searchByuser = localStorage.getItem('search_by');
    this.searchJobByuser = localStorage.getItem('search_by');
    this.getSiteSettings();
    this.usersService.topheader.subscribe(userType => {
      if (userType === 'Admin') {
        this.router.navigateByUrl('/admin/dashboard');
      }
      if (userType == 'guest') {
        this.isGuest = true;
      } else {
        this.isGuest = false;
        this.loginusername = this.apiService.decodejwts().first_name +' '+this.apiService.decodejwts().last_name;
        if(this.loginusername == 'undefined undefined'){
          this.logout();
        }
        if(this.apiService.decodejwts().userid === undefined || this.apiService.decodejwts().userid == null){
          return;
        }
        this.queryUserID = this.apiService.decodejwts().userid + '/';
        this.apiService.getRequest(constant.apiurl + constant.get_user_details + this.queryUserID).subscribe(
          data => {
            this.profileDetails = data;
            if (this.profileDetails.body != '') {
              this.onlineStatus = this.profileDetails.body.online_status;
              this.profileHeaderImage = this.profileDetails.body.profile.avatar;
              this.availableConnects = this.profileDetails.body.profile.connects;
              this.unseen_count = this.profileDetails.body.profile.unseen_count;
              this.usersService.setAvailableConnect(this.availableConnects);
              this.usersService.setPaymentVerified(this.profileDetails.body.profile.payment_verify);
              this.userType = this.profileDetails.body.profile.user_type;
              this.usersService.setTimezone(this.profileDetails.body.profile.timezone);
              this.usersService.setJobcount(this.profileDetails.body.profile.job_count);
              this.usersService.setBillingcount(this.profileDetails.body.profile.billing);
              this.created = this.profileDetails.body.profile.created;
            }
          }, err => {
            console.log(err);
          });
      }
    });

    this.usersService.headerLayoutAlert.subscribe(headerLayout => {
      if (headerLayout.length > 0) {
        if (headerLayout == 'layout1') {
          this.isLayout1 = true;
          this.isLayout2 = false;
          this.commonProfile = '';
        } else if (headerLayout == 'layout2') {
          this.isLayout1 = false;
          this.isLayout2 = true;
          this.commonProfile = 'common_profile';
        } else if (headerLayout == 'layout3') {
          this.isLayout1 = false;
          this.isLayout2 = false;
          this.commonProfile = '';
        }
      }
    });

    this.usersService.timezones.subscribe(zone => {
      this.zone = zone;
    });

    /* Check auth login - start */
    if (!this.auth.isLogged) {
      return true;
    } else {
      if (this.withoutloginpage.indexOf(window.location.pathname) > -1) {
        // this.router.navigate(['/']);
        this.redirectAfterLogin();
      }
     
    }
    /* Check auth login - end */

    const user =localStorage.getItem('user_type');
    if(user =='Freelancer'){
      this.searchPlaceholder ='Job';
      this.searchByChange ='Job';
    }
    if(user == 'Client'){
      this.searchPlaceholder = 'Freelancer';
      this.searchByChange = 'Freelancer';

    }

  }

  redirectAfterLogin() {
    const queryUserID = this.apiService.decodejwts().userid + '/';
    this.apiService.getRequest(constant.apiurl + constant.updateUserDetails + queryUserID).subscribe(
      row => {
        const profileDetails = row['body'];
        if (profileDetails != '') {
          const usertype = profileDetails.profile.user_type;
          this.loggedInType = usertype;
          if (usertype === 'Admin') {
            this.router.navigateByUrl('/admin/dashboard');
          } else if (usertype === 'Freelancer') {
            if (profileDetails.profile.category == null || profileDetails.profile.category === '' || profileDetails.profile.category === 'None') {
              this.router.navigate(['/user/basic']);
            } else if (
              profileDetails.profile.category !== '' &&
              profileDetails.profile.category != null && profileDetails.profile.category !== 'None' &&
              (profileDetails.profile.title === '' || profileDetails.profile.title == null)) {
              this.router.navigate(['/freelancer/more']);
            } else if (
              profileDetails.profile.category !== '' &&
              profileDetails.profile.category != null &&
              profileDetails.profile.category !== 'None' &&
              profileDetails.profile.title !== '' && profileDetails.profile.title != null) {
              this.router.navigate(['/search/job']);
            }
          } else {
            const clientusertype = profileDetails.profile.user_type;
            if (clientusertype === 'Client') {
              if (profileDetails.profile.company_employees == null || profileDetails.profile.company_employees === '') {
                this.router.navigate(['/profile/basic']);
              } else {
                this.router.navigateByUrl('/joblisting');
              }
            }
          }
        }
      }, (err: HttpErrorResponse) => {
        if(err.status == 401) {
          //un-authorized request was made. force logout.
          this.logout();
        }
        console.log(err);
      });
  }

  userOnlineStatus(status) {
    const params = { 'online_status': status, 'profile': {} };
    this.apiService.putRequest(constant.apiurl + constant.get_user_details + this.queryUserID, params).subscribe(
      data => {
        this.resUserData = data;
      }, err => {
        console.log(err);
      });
  }

  changeroute(searchholdertxt) {
    this.searchPlaceholder = searchholdertxt;
    this.searchByChange = searchholdertxt;
    this.searchByIcon = searchholdertxt === 'Freelancer' ? 'people' : 'picture_in_picture';
  }

  onSearchBy() {
    this.searchByValue = this.searchBy.nativeElement.value;
    if (this.searchByChange == 'Freelancer') {
      localStorage.setItem('search_by', this.searchByValue);
      this.router.navigate(['/search/freelancer']);
    } else if (this.searchByChange == 'Job') {
      localStorage.setItem('search_by', this.searchByValue);
      this.router.navigate(['/search/job']);
    }
  }

  ngAfterViewChecked() {
   const user =localStorage.getItem('user_type');
    const url = this.activeUrl = this.router.url;
    if (url === '/' || url.includes('/?fbclid') || (url.includes('/jobdetail')&& user == null) ) {
      this.is_home = true;
      this.is_pg_class = '';
      if(url === '/' && user=='Freelancer'){
        this.router.navigate(['/search/job']);
      }else if(url === '/' && user=='Client'){
        this.router.navigate(['/joblisting']);
      }
    } else {
      this.is_home = false;
      this.is_pg_class = 'work_innerwrap';
    }
    this.cdr.detectChanges();
  }

  logout() {
    localStorage.removeItem('workplus_token');
    localStorage.removeItem('exp_token');
    localStorage.removeItem('user_type');
    localStorage.removeItem('againreset');
    localStorage.removeItem('workplus_logo');
    localStorage.removeItem('workplus_appname');
    localStorage.removeItem('workplus_favicon');
    localStorage.removeItem('wp_withdraw_option');
    localStorage.removeItem('wp_withdraw_fee_bank');
    localStorage.removeItem('wp_withdraw_fee_paypal');
    localStorage.removeItem('temp_path');
    localStorage.removeItem('wp_payment');
    localStorage.removeItem('wp_payment_method');
    localStorage.removeItem('freelancerview');
    localStorage.removeItem('hdr');
    sessionStorage.removeItem('setpage');
    this.usersService.userlogin('guest');
    this.router.navigate(['/']);
  }

  onHowItWorks() {
    const x: Element = document.querySelector('#howitworks');
    if (x) {
      x.scrollIntoView({ behavior: 'smooth' });
    }
  }

  onPricing() {
    const x: Element = document.querySelector('#prices');
    if (x) {
      x.scrollIntoView({ behavior: 'smooth' });
    }
  }
  getSiteSettings() {
    const siteLogo = localStorage.getItem('workplus_logo');
    if (siteLogo != "" && typeof siteLogo != 'undefined' && siteLogo != null && siteLogo != 'null') {
      this.logo_url = siteLogo;
      this.application_name = localStorage.getItem('workplus_appname');
      this.titleService.setTitle(this.application_name);
      this.favicon = localStorage.getItem('workplus_favicon');
      this.document.getElementById('appFavicon').setAttribute('href', this.favicon);
    } else {
      const getSiteDetailsUrl = constant.apiurl + constant.adminSettingsOptions;
      this.apiService.getRequest(getSiteDetailsUrl).subscribe(
        result => {
          this.siteSettings = result;
          if (this.siteSettings.status === 200 && this.siteSettings.ok === true) {
            if (typeof this.siteSettings.body.options.frontend_logo != 'undefined') {
              this.logo_url = constant.imgurl + this.siteSettings.body.options.frontend_logo;
              localStorage.setItem('workplus_logo', constant.imgurl + this.siteSettings.body.options.frontend_logo);
            }
            if (typeof this.siteSettings.body.options.application_name != 'undefined') {
              this.application_name = this.siteSettings.body.options.application_name;
              this.titleService.setTitle(this.siteSettings.body.options.application_name);
              localStorage.setItem('workplus_appname', this.siteSettings.body.options.application_name);
            }
            if (typeof this.siteSettings.body.options.fav_icons != 'undefined') {
              localStorage.setItem('workplus_favicon', constant.imgurl + this.siteSettings.body.options.fav_icons);
              this.document.getElementById('appFavicon').setAttribute('href', constant.imgurl + this.siteSettings.body.options.fav_icons);
            }
            if (typeof this.siteSettings.body.options.connect != 'undefined') {
              localStorage.setItem('workplus_connect', this.siteSettings.body.options.connect);
            }
            if (typeof this.siteSettings.body.options.withdraw_fee_bank != 'undefined') {
              localStorage.setItem('wp_withdraw_fee_bank', this.siteSettings.body.options.withdraw_fee_bank);
            }
            if (typeof this.siteSettings.body.options.withdraw_fee_paypal != 'undefined') {
              localStorage.setItem('wp_withdraw_fee_paypal', this.siteSettings.body.options.withdraw_fee_paypal);
            }
            if (typeof this.siteSettings.body.options.withdraw_option != 'undefined') {
              localStorage.setItem('wp_withdraw_option', this.siteSettings.body.options.withdraw_option);
            }
          }
        });
    }
  } 
    /** Get Notification list */
    isnotificationison:boolean = false;
  getNotifications() {
    this.isnotificationison = true;
      this.notifyPopupDialogRef = this.dialog.open(NotificationPopupComponent, {
        disableClose: false,
        hasBackdrop: true,
        data: { 'method': 'add' },
        position: {
          top: '60px'
        },
        panelClass: 'notification-modal'
      });

      this.notifyPopupDialogRef.afterClosed().subscribe(result => {
      if(result.status == 'success'){
        this.unseen_count = 0;
      }else{
        this.unseen_count = this.unseen_count - 1;
      }
    });
  }
  onClickOutside(event:Object) {
    if(this.isnotificationison == true){
      this.notifyPopupDialogRef.close();
      this.isnotificationison = false;
    }
  }

  goToLink(url: string){
    window.open(url, "_blank");
  }

  toggle() {
    this.show = !this.show;

    // CHANGE THE NAME OF THE BUTTON.
    if(this.show)  
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
  }
}
