import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

import { UserService } from '../../../services/sync/user.service';
import { ApiService } from '../../../services/api/api.service';
import { country } from '../../../../data/country';
import { constant } from '../../../../data/constant';

import { ProfileimageComponent } from '../profileimage/profileimage.component';

@Component({
  selector: 'app-flregmoredetails',
  templateUrl: './flregmoredetails.component.html',
  styleUrls: ['./flregmoredetails.component.css']
})
export class FlregmoredetailsComponent implements OnInit {
  moreDetailForm: FormGroup;
  dailytypes = [
    { 'key': '1', 'name': 'More than 30 hrs/week' },
    { 'key': '2', 'name': 'Less than 30 hrs/week' },
    { 'key': '3', 'name': 'As Needed - Open to Offers' },
  ];
  defaultType = '1';
  defaultLang = 'Intermediate';
  englevels = [
    { 'key': 'Elementary', 'name': 'Elementary' },
    { 'key': 'Intermediate', 'name': 'Intermediate' },
    { 'key': 'Advanced', 'name': 'Advanced' },
    { 'key': 'Proficient', 'name': 'Proficient' }
  ];
  queryUserID: any;
  errorMsg: String;
  errorMsgArr: any = [];
  initialData;
  locations: any = country.list;

  is_profile_pic_uploaded: boolean = false;
  imagePath = '';
  pathimage = '';
  register_type: String;
  first_name = '';
  last_name = '';
  initialProfileData: any;
  requestParams = {
    'first_name': this.first_name,
    'last_name': this.last_name,
    'email' : '',
    'profile': {
      'avatar': '',
      'daily_availability': '',
      'title': '',
      'description': '',
      'english_level': '',
      'hourly_rate': '',
      'phone': '',
      'address': '',
      'city': '',
      'state': '',
      'country': 'NP',//default
      'zipcode': '00000',//default
    }
  };

  @ViewChild('ratevalue') rate: any;
  percentagevalue;
  remainingvalue;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private userService: UserService,
    private apiService: ApiService,
    private router: Router,
  ) {
    this.moreDetailForm = fb.group({
      'title' : [null, Validators.compose([Validators.required])],
      'description' : [null, Validators.compose([Validators.required])],
      'english_level' : [null, Validators.compose([Validators.required])],
      'hourly_rate' : [null, Validators.compose([Validators.required])],
      'daily_availability' : [null, Validators.compose([Validators.required])],
      'phone' : [null, Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(10)])],
      'address' : [null, Validators.compose([Validators.required])],
      'city' : [null, Validators.compose([Validators.required])],
      'state' : [null, Validators.compose([Validators.required])],
    });
  }

  ngOnInit() {
    this.getUserProfile();
  }

  getUserProfile() {
    this.queryUserID = this.apiService.decodejwts().userid + '/';
    this.apiService.getRequest(constant.apiurl + constant.get_user_details + this.queryUserID).subscribe(
      data => {
        this.initialData = data;
        if (this.initialData.status === 200) {
          this.initialProfileData = this.initialData.body;
          this.requestParams['first_name'] = this.first_name = this.initialProfileData.first_name;
          this.requestParams['last_name'] = this.last_name = this.initialProfileData.last_name;
          this.requestParams['email'] = this.initialProfileData.email;
          this.requestParams['profile']['avatar'] = this.initialProfileData.profile.avatar;
          this.pathimage = this.initialProfileData.profile.avatar;
          if(this.initialProfileData.profile.avatar){
            this.imagePath = constant.imgurl + this.initialProfileData.profile.avatar;
          }else{
            this.imagePath = '';
          }
          
          this.register_type = this.initialProfileData.profile.user_type;
          if (this.initialProfileData.profile.title != '' && this.initialProfileData.profile.title != null ) {
            this.router.navigate(['/freelancerprofile']);
          }
        }

      }, err => {
        console.log(err);
    });
  }
  /* common number only type */
  isNumber(evt) {
    evt = (evt) ? evt : window.event;
    const charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
  }

  isFloat(event) {
    if (event.which < 46 || event.which > 59) {
        event.preventDefault();
    } // prevent if not number/dot
    if (event.which == 46 && event.target.value.indexOf('.') != -1) {
        event.preventDefault();
    }
    const twoDigit = parseFloat(this.rate.nativeElement.value);
    const findLength = twoDigit.toString().split('.')[1];
    if(findLength === undefined) return;
    if (findLength != '' && findLength.length > 1 ) {
      this.rate.nativeElement.value = twoDigit.toFixed(1);
    }
}

calculaterate() {
  if (this.rate.nativeElement.value > 0 && this.rate.nativeElement.value !== '' && this.rate.nativeElement.value !== null) {
    this.percentagevalue = this.rate.nativeElement.value * 20 / 100;
    this.percentagevalue = this.percentagevalue.toFixed(2);
    this.remainingvalue = this.rate.nativeElement.value - this.percentagevalue;
    this.remainingvalue = this.remainingvalue.toFixed(2);
  } else {
    this.percentagevalue = 0.00;
    this.remainingvalue = 0.00;
  }
}
  /* Edit Profile Image Functionality - start */
  editProfileImage() {
    const dialogRefimage = this.dialog.open(ProfileimageComponent, {
      disableClose: true,
      data: {first_name: this.first_name, last_name: this.first_name, imagePath : this.imagePath, pathimage : this.pathimage }
    });

    dialogRefimage.afterClosed().subscribe(result => {
      if (result != 'cancel') {
        this.imagePath = constant.imgurl + result.imagePath;
        this.pathimage = result.imagePath;
        this.requestParams['profile']['avatar'] =   result.imagePath;
        if(result.imagePath.includes('/media/files/files/')){
          this.is_profile_pic_uploaded = true;
        }
        this.apiService.putRequest(constant.apiurl + constant.updateUserDetails + this.queryUserID, this.requestParams ).subscribe(
            data => {
            this.userService.snackMessage('Profile image updated');
            this.userService.headerInfo(this.register_type);
            }, err => {
              console.log(err);
        });
      }
    });
  }
  /* End Profile Image Functionality */
  submitMoreDetailForm(formData) {
    this.errorMsg = '';
    this.errorMsgArr = [];
    
    if (this.moreDetailForm.valid) {
      if(this.is_profile_pic_uploaded !=true) {
        this.userService.snackErrorMessage('Please upload a profile pic.');
        this.errorMsg = 'Please upload a profile pic';
        return false;
      }

      this.requestParams['profile']['daily_availability'] = formData.daily_availability;
      this.requestParams['profile']['title'] = formData.title;
      this.requestParams['profile']['description'] = formData.description;
      this.requestParams['profile']['english_level'] = formData.english_level;
      if(formData.hourly_rate < 1){
        this.userService.snackMessage('Please enter Hourly Rate From 1 Hr');
        return false;
      }
      this.requestParams['profile']['hourly_rate'] = formData.hourly_rate;
      this.requestParams['profile']['phone'] = formData.phone;
      this.requestParams['profile']['address'] = formData.address;
      this.requestParams['profile']['city'] = formData.city;
      this.requestParams['profile']['state'] = formData.state;

      this.apiService.putRequest(constant.apiurl + constant.updateUserDetails + this.queryUserID, this.requestParams ).subscribe(
        data => {
        this.userService.snackMessage('Profile details successfully updated.');
        this.userService.headerInfo(this.register_type);
        this.router.navigate(['/freelancerprofile']);
        }, err => {
          console.log(err);
      });
    } else {
      this.errorMsg = 'error';
    }
  }

  geterrorMsg(field) {
    if (field === 'phone') {
      return this.moreDetailForm.controls[field].hasError('required')
      || this.moreDetailForm.controls[field].hasError('minlength')
      || this.moreDetailForm.controls[field].hasError('maxlength') ? 'Please enter valid phone number' : '';
    } else {
      return this.moreDetailForm.controls[field].hasError('required') ? 'Field is required' : '';
    }
  }
}
