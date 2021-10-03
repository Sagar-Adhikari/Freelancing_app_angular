import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { UserService } from '../../../services/sync/user.service';
import { ApiService } from '../../../services/api/api.service';
import { country } from '../../../../data/country';
import { timezone } from '../../../../data/timezone';
import { constant } from '../../../../data/constant';

import { ProfileimageComponent } from '../profileimage/profileimage.component';
import { FlcategorydialogComponent } from './flcategorydialog/flcategorydialog.component';

import { AuthService } from 'angularx-social-login';
import { SocialUser } from 'angularx-social-login';
import { FacebookLoginProvider, GoogleLoginProvider, LinkedInLoginProvider } from 'angularx-social-login';

@Component({
  selector: 'app-flsettingprofile',
  templateUrl: './flsettingprofile.component.html',
  styleUrls: ['./flsettingprofile.component.css']
})
export class FlsettingprofileComponent implements OnInit {
  setMyProfileForm: FormGroup;
  setMyProfileExpForm: FormGroup;
  queryUserID = this.apiService.decodejwts().userid;

  visibilityTypes = [
    { 'key': 'Public', 'name': 'Public' },
    { 'key': 'Private', 'name': 'Private' },
    { 'key': 'User Only', 'name': 'Only show my profile to Remote Nepal users logged in' },
  ];
  preferenceTypes = [
    { 'key': 'both', 'name': 'Both long-term and one-time projects' },
    { 'key': 'long', 'name': 'Longer-term projects 3+ months long' },
    { 'key': 'short', 'name': 'Shorter-term projects < 3 months long' },
  ];
  initialData: any;
  initialredirectData: any;
  initialProfileData: any;
  initialProfileRedirectData: any;
  userID; user_email;
  updatedVisibility;
  updatedPreference;
  //updatedPaypal;
  experience_level;
  categoryNameString: any;
  categoryNameArr: any;

  exp_levels = [
    { 'key': 'Entry', 'name': 'Entry Level' },
    { 'key': 'Intermediate', 'name': 'Intermediate' },
    { 'key': 'Expert', 'name': 'Expert' }
  ];

  // vaildation error message
  errorMsg: String;
  errorMsgArr: any = [];
  errorMsgExp: String;
  errorMsgExpArr: any = [];

  // security question variable decalaration
  initialQuesData: any;

  private user: SocialUser;
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private userService: UserService,
    private apiService: ApiService,
    private router: Router,
    private socialAuthService: AuthService
  ) {
    this.setMyProfileForm = fb.group({
      'visibility' : [null, Validators.compose([Validators.required])],
      //'paypal_email' : [null, Validators.compose([Validators.required])],
      'project_preference' : [null, Validators.compose([Validators.required])],
    });
    this.setMyProfileExpForm = fb.group({
      'experience_level' : [this.experience_level, Validators.compose([Validators.required])],
    });
  }

  ngOnInit() {
    this.socialAuthService.authState.subscribe((user) => {
      this.user = user;
      this.socialAuthService.signOut();
    });
    setTimeout(() => {
      this.apiService.getRequest(constant.apiurl + constant.get_user_details + this.userID + '/').subscribe(
        data => {
          this.initialredirectData = data;
          if (this.initialredirectData.status === 200) {
            this.initialProfileRedirectData = this.initialredirectData.body;
            console.log(this.initialProfileRedirectData);
            if ( this.initialProfileRedirectData.profile.category == 'None' || this.initialProfileRedirectData.profile.category == null) {
              this.router.navigate(['user/basic']);
              return false;
            } else if ( this.initialProfileRedirectData.profile.title == '' || this.initialProfileRedirectData.profile.title == null ) {
              this.router.navigate(['/freelancer/more']);
              return false;
            }
          }
        }, err => {
          console.log(err);
      });
    }, 500);
    this.userService.sendHeaderLayout('layout2');
    this.getUserProfile();
    if ( localStorage.getItem('againreset') === '1') {
      this.getUserQuestion();
    }
  }

  getUserQuestion() {
    this.apiService.getRequest(constant.apiurl + constant.get_questionres+'?user=' + this.queryUserID).subscribe(
      data => {
        this.initialQuesData = data;
        if (this.initialQuesData.body.count > 0) {
          this.router.navigate(['security/password']);
        }
      }, err => {
        console.log(err);
    });
  }

  signInWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithFB(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  getUserProfile() {
    this.apiService.getRequest(constant.apiurl + constant.updateUserDetails + this.queryUserID + '/').subscribe(
      data => {
        this.initialData = data;
        if (this.initialData.status === 200) {
          this.initialProfileData = this.initialData.body;
          this.userID = this.initialProfileData.id;
          this.user_email = this.initialProfileData.email;
          this.updatedVisibility = this.initialProfileData.profile.visibility;
          this.updatedPreference = this.initialProfileData.profile.project_preference;
          //this.updatedPaypal = this.initialProfileData.profile.paypal_email;
          this.experience_level = this.initialProfileData.profile.experience_level;
          this.setMyProfileExpForm.patchValue({
            'experience_level': this.initialProfileData.profile.experience_level
          });
          //this.setMyProfileForm.patchValue({
          //  'paypal_email': this.updatedPaypal
          //});
          this.categoryNameString = this.initialProfileData.profile.category_name;
          if ( this.categoryNameString !== '' && this.categoryNameString !== null ) {
            console.log(this.initialProfileData.profile.category)
            this.categoryArrConv(this.categoryNameString);
          }
        }
      }, err => {
        console.log(err);
    });
  }

  categoryArrConv(category) {
    this.categoryNameArr = category.split(',');
  }

  submitSetMyProfileForm(formData) {
    this.errorMsg = '';
    this.errorMsgArr = [];
    if (this.setMyProfileForm.valid) {
      const params = {
        'id': this.userID,
        'email': this.user_email,
        'profile': {
          'visibility': formData.visibility,
          'project_preference': formData.project_preference,
          //'paypal_email': formData.paypal_email
        }
      };
      this.apiService.putRequest(constant.apiurl + constant.updateUserDetails + this.queryUserID  + '/', params ).subscribe(
        data => {
          this.userService.snackMessage('Profile Details updated');
        }, err => {
          console.log(err);
      });
    } else {
      this.errorMsg = 'error';
    }
  }

  submitSetProExpForm(formData) {
    this.errorMsgExp = '';
    this.errorMsgExpArr = [];
    if (this.setMyProfileExpForm.valid) {
      const params = {
        'id': this.userID,
        'email': this.user_email,
        'profile': {
          'experience_level': formData.experience_level,
        }
      };
      this.apiService.putRequest(constant.apiurl + constant.updateUserDetails + this.queryUserID + '/', params ).subscribe(
        data => {
          this.userService.snackMessage('Profile Experience details updated');
        }, err => {
          console.log(err);
      });
    } else {
      this.errorMsgExp = 'error';
    }
  }

  geterrorMsg(field) {
      return this.setMyProfileForm.controls[field].hasError('required') ? 'Field is required' : '';
  }

  geterrorExpMsg(field) {
    return this.setMyProfileExpForm.controls[field].hasError('required') ? 'Field is required' : '';
  }

  updateCategory() {
    const dialogCategory = this.dialog.open(FlcategorydialogComponent, {
      disableClose: true,
      data: {
        'category' : this.categoryNameArr
      }
    });
    dialogCategory.beforeClose().subscribe(result => {
      this.categoryArrConv(result.fromDialogCategory);
    });
    dialogCategory.afterClosed().subscribe(result => {
      this.categoryArrConv(result.fromDialogCategory);
      if (result.status === 'success') {
        this.userService.snackMessage('Category updated Successfully');
      }
    });
  }
}
