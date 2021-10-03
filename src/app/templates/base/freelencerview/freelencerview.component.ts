import { Component, OnInit } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { DeleteconfirmComponent } from './../postjob/deleteconfirm/deleteconfirm.component';
import { FreelancedialogsComponent } from '../freelancedialogs/freelancedialogs.component';
import { FldescpdialogComponent } from '../freelancedialogs/fldescpdialog/fldescpdialog.component';
import { FlvideodialogComponent } from '../freelancedialogs/flvideodialog/flvideodialog.component';
import { FlplayvideodialogComponent } from '../freelancedialogs/flplayvideodialog/flplayvideodialog.component';
import { FlhourlyrateComponent } from '../freelancedialogs/flhourlyrate/flhourlyrate.component';
import { FlskilldialogComponent } from '../freelancedialogs/flskilldialog/flskilldialog.component';
import { FlotherexpdialogComponent } from '../freelancedialogs/flotherexpdialog/flotherexpdialog.component';
import { FledudialogComponent } from '../freelancedialogs/fledudialog/fledudialog.component';
import { FlempdialogComponent } from '../freelancedialogs/flempdialog/flempdialog.component';
import { FlavailabledialogComponent } from '../freelancedialogs/flavailabledialog/flavailabledialog.component';
import { FlportdialogComponent } from '../freelancedialogs/flportdialog/flportdialog.component';
import { FlenglangdialogComponent } from '../freelancedialogs/flenglangdialog/flenglangdialog.component';

import { InviteFreelencerComponent } from '../invite-freelencer/invite-freelencer.component';
import { ApiService } from '../../../services/api/api.service';
import { constant, inputData } from '../../../../data/constant';
import { country } from '../../../../data/country';
import { UserService } from '../../../services/sync/user.service';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-freelencerview',
  templateUrl: './freelencerview.component.html',
  styleUrls: ['./freelencerview.component.css']
})
export class FreelencerviewComponent implements OnInit {
  queryUserID; userID; emailAddress; apiUrl; update_url; jobdescription; jobvideo;
  jobvideotype; jobhourlyrate = 0; skills; skillId; available; expected;
  responseDataOther;
  responseDataEdu;
  responseDataEmp;
  editJobTitleDisplay = false;
  editJobDescriptionDisplay = false;
  editVideoDisplay = false;
  editRateDisplay = false;
  editAvailableDisplay = false;
  wish_id: any;
  profileDetails: any;
  rating;
  resultData: any;
  hireme: any;
  loggeduser: any;
  responseHire: any;
  otherExpResultData: any = [];
  eduResultData: any = [];
  empResultData: any = [];
  portResultData: any = [];
  margeOtherLang: any = [];

  profileImage = 'assets/images/profile_default.png';
  copylink = '';
  firstName;
  lastName;
  jobtitle;
  country;
  current_time:any;
  state;
  allCategory;
  english_level;
  image_url = constant.imgurl;
  textLength = 150;
  initialTextLength = 150;
  morelessText = 'More';
  /* drop-down year */
  currentyear; formyears: any= []; toyears: any= [];
  dailytypes = [
    { 'key': '1', 'name': 'More than 30 hrs/week' },
    { 'key': '2', 'name': 'Less than 30 hrs/week' },
    { 'key': '3', 'name': 'As Needed - Open to Offers' },
  ];
  countries: any = country.list;
  selectedAvailable; findselectedAvailable: any;
  pagenumber: any;
  user_type: string;
  jobs_count: any;
  invitation:boolean = false;
  is_wishlist:boolean = false;
  displayColor = '';
  constructor(
    private apiService: ApiService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    public router: Router,
    public location: Location,
    private syncVar: UserService,
    private ratingConfig: NgbRatingConfig,
  ) {
    this.ratingConfig.max = inputData.maximumRatingConfig;
    this.ratingConfig.readonly = true;
    this.syncVar.jobcounts.subscribe(counts => {
        this.jobs_count = counts;
    });    
  }

  Addwishlistfreelancerfunc() {
    const params = {
      'user': this.apiService.decodejwts().userid,
      'freelancer': this.userID
    };
    this.apiService.postRequest(constant.apiurl + constant.freelancerwishlistadd + '/', params).subscribe(
      data => {
        this.syncVar.snackMessage('successfully added to wishlist');
        localStorage.setItem('freelancerview','false');
          this.router.navigate(['/search/freelancer']);
      }, err => {
              console.log(err)
      });
  }

  Removewishlistfreelancerfunc(savedUserId) {
    this.apiService.deleteRequest(constant.apiurl + constant.freelancerwishlist + '/' + savedUserId + '/', '')
      .subscribe(response => {
        this.syncVar.snackMessage('successfully deleted from wishlist');
        this.router.navigate(['/search/freelancer']);
      });
  }
  ngOnInit() {
    this.user_type = this.apiService.decodejwts().user_type;
    this.loggeduser = this.apiService.decodejwts().userid;
    this.apiUrl = constant.apiurl;
    this.update_url = constant.updateUserDetails;
    this.apiService.getRequest(this.apiUrl + this.update_url + this.loggeduser ).subscribe(
      data => {
        this.resultData = data;
        if (this.resultData.body !== []) {
          this.profileDetails = this.resultData.body;
          this.user_type = this.profileDetails.profile.user_type;
        }
      });

    this.pagenumber = this.route.snapshot.queryParamMap.get('page') ? this.route.snapshot.queryParamMap.get('page') : '';
    this.route.params.subscribe(params => {
        this.queryUserID = params['id'] + '/';
        this.userID = params['id'];
    });
    this.copylink = constant.siteBaseUrl + 'freelancerview/' + this.userID;
    this.emailAddress = '';

    this.apiService.getRequest(this.apiUrl + this.update_url + this.queryUserID ).subscribe(
      data => {
        this.resultData = data;
        if (this.resultData.body !== []) {
          this.profileDetails = this.resultData.body;
          this.profileImage = this.profileDetails.profile.avatar !== '' && this.profileDetails.profile.avatar !== null ? this.image_url + this.profileDetails.profile.avatar : this.profileImage;
          this.firstName = this.profileDetails.first_name;
          this.lastName = this.profileDetails.last_name;

          this.rating = this.profileDetails.profile.rating;
          this.current_time = this.profileDetails.profile.current_time;
          this.country = this.profileDetails.profile.country;
          this.state = this.profileDetails.profile.state;
          this.jobtitle = this.profileDetails.profile.title;
          this.jobdescription = this.profileDetails.profile.description;
          this.jobvideo = this.profileDetails.profile.video_url;
          this.jobvideotype = this.profileDetails.profile.video_type;
          this.jobhourlyrate = this.profileDetails.profile.hourly_rate;
          this.skills = this.profileDetails.profile.offer_skill != '' && this.profileDetails.profile.offer_skill != null ? this.profileDetails.profile.offer_skill.split(',') : [];
          this.skillId = this.profileDetails.profile.category_skill;
          this.available = this.profileDetails.profile.daily_availability;
          this.expected = this.profileDetails.profile.expected_availability;
          this.invitation = this.profileDetails.profile.is_invitation;
          this.is_wishlist = this.profileDetails.profile.is_wishlist;
          this.wish_id = this.profileDetails.profile.wish_id;
          this.margeOtherLang = this.profileDetails.profile.other_language ? JSON.parse(this.profileDetails.profile.other_language) : [];
          this.findselectedAvailable = this.dailytypes.find( row => row.key == this.available);
          if (this.findselectedAvailable !== [] && this.findselectedAvailable != null) {
            this.selectedAvailable = this.findselectedAvailable.name;
          }
          if (this.jobdescription != null && this.jobdescription != "") {
            if ( this.jobdescription.length < this.initialTextLength ) {
              this.morelessText = '';
            }
          }
          this.english_level = this.profileDetails.profile.english_level;
        }
      }, err => {
        console.log(err);
        this.router.navigate(['/']);
    });
    /* Year drop-down field - start */
    const dt = new Date();
    this.currentyear = dt.getFullYear();
    for (let year = this.currentyear; year >= 1940; year--) {
      this.formyears.push({'name': year, 'value': year});
    }
    for (let year = this.currentyear + 7; year >= 1940; year--) {
      this.toyears.push({'name': year, 'value': year});
    }
    /* Year drop-down field - end */
    this.getAllCategory();
    this.getOtherExp();
    this.getEducation();
    this.getEmpoly();
    this.getPortfolio();
    this.getHireMe();
    sessionStorage.removeItem('form_category');
    sessionStorage.removeItem('form_data');
  }

  onMoreFun(textlength, findText) {
    console.log(textlength);
    if ( findText === 'More') {
      this.textLength = textlength;
      this.morelessText = 'Less';
    } else {
      this.textLength = 150;
      this.morelessText = 'More';
    }
    this.morelessText = this.morelessText;
    if ( this.jobdescription.length < this.initialTextLength ) {
      this.morelessText = '';
    }
    console.log(findText);
  }

  getHireMe() {
    console.log(this.loggeduser);
    if(this.loggeduser){
    this.apiService.getRequest(constant.apiurl + constant.getHire + '?user_id='+this.loggeduser+'&freelancer_id='+this.userID)
      .subscribe(responseData => {
        console.log(responseData['body']);
        this.responseHire = responseData['body'].status;
        if (this.responseHire) {
          this.hireme = 'Rehire Now';
        } else {
          this.hireme = 'Hire Now';
        }
      });
    }
  }

  getAllCategory() {
    this.apiService.getRequest(constant.apiurl + constant.job_category_all + '?search=')
      .subscribe(responseData => {
        this.allCategory = responseData['body'];
      });
  }
  getOtherExp() {
    this.apiService.getRequest(this.apiUrl + constant.saveotherexp + '?user=' + this.userID ).subscribe(
      data => {
        this.otherExpResultData = data['body']['results'];
      });
  }
  getEducation() {
    this.apiService.getRequest(this.apiUrl + constant.educationupdate + '?user=' + this.userID).subscribe(
      data => {
        this.eduResultData = data['body']['results'];
      });
  }
  getEmpoly() {
    this.apiService.getRequest(this.apiUrl + constant.emp_url + '?user=' + this.userID).subscribe(
      data => {
        this.empResultData = data['body']['results'];
      });
  }
  getPortfolio() {
    this.apiService.getRequest(this.apiUrl + constant.portfolio_url + '?user=' + this.userID).subscribe(
      data => {
        this.portResultData = data['body']['results'];
      });
  }
  skillBasedSearch(skill) {
    this.router.navigate(['/search/freelancers/'+skill]);
  }
  onPlayVideo() {
    if (this.jobvideo) {
      const dialogPlayVideo = this.dialog.open(FlplayvideodialogComponent, {
        disableClose: true,
        data: {
          'content': {
            'video': this.jobvideo
          }
        }
      });
    } else {
      this.syncVar.snackMessage('Freelancer not upload any video preview');
    }
  }

  previouspage() {
    this.location.back();
  }

   invitationPopup(){
      const dialogChoosecat = this.dialog.open(InviteFreelencerComponent, {
        disableClose: true,
        data: {'freelancer_id': this.userID, 'freelancer_name':this.firstName+' '+this.lastName}
      });

      dialogChoosecat.afterClosed().subscribe(result => {
        if(result=='close'){
          this.invitation = true;
        }
      });
    }
  
    displayCopyColor() {
      this.displayColor = '#ae2838';
      this.syncVar.snackMessage('Profile link copied');
    }

}
