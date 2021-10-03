import { Component, OnInit } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { UserService } from '../../../../services/sync/user.service';
import { ApiService } from '../../../../services/api/api.service';
import { country } from '../../../../../data/country';
import { timezone } from '../../../../../data/timezone';
import { constant } from '../../../../../data/constant';

import { ProfileimageComponent } from '../../profileimage/profileimage.component';

@Component({
  selector: 'app-contactsetting',
  templateUrl: './contactsetting.component.html',
  styleUrls: ['./contactsetting.component.css']
})
export class ContactsettingComponent implements OnInit {
  activemenu;
  queryUserID = this.apiService.decodejwts().userid;
  initialData: any;
  initialProfileData: any;
  initialProfileDataTemp: any;
  first_name: String;
  last_name: String;
  mail_address: String;
  register_type: String;
  isbuttondisable = true;
  errorMsg: String;
  // Account Form - start
  accountProfileForm: FormGroup;
  displayAccountForm = false;
  accountresult: any;
  // validation message display
  errorAccountMsg = '';
  errorAccountMsgArr: any;
  // Account Form - end

  // Email Form - start
  emailEditForm: FormGroup;
  displayEditForm = false;
  // validation message display
  errorEmailMsg = '';
  errorEmailMsgArr: any;
  // Email Form - end

  // Phone Form - start
  phoneEditForm: FormGroup;
  displayPhoneForm = false;
  errorPhoneMsg = '';
  errorPhoneMsgArr: any;
  phoneResult: any;
  // Phone Form - end

  // timezone Form - start
  timezoneEditForm: FormGroup;
  displaytimezoneForm = false;
  errortimezoneMsg = '';
  errortimezoneMsgArr: any;
  timezoneResult: any;
  // timeZoneLists: any = timezone.list;
  timeZoneLists: any;
  timezoneResponse:any;
  // timezone Form - end
  // address Form - start
  addressEditForm: FormGroup;
  displayaddressForm = false;
  erroraddressMsg = '';
  erroraddressMsgArr: any;
  addressResult: any;
  locations: any = country.list;
  // address Form - end
  // invoice address Form - start
  iaddressEditForm: FormGroup;
  idisplayaddressForm = false;
  ierroraddressMsg = '';
  ierroraddressMsgArr: any;
  iaddressResult: any;
  ilocations: any = country.list;
  invoiceAddressresult: any;
  showInvoiceAddr = false;
  icheck = 2;
  iupdatedAddress = '';
  iupdatedState = '';
  iupdatedCity = '';
  iupdatedCountry = '';
  iupdatedZipcode = null;
  // invoice address Form - end
  imagePath = '';
  updatedAddress = '';
  updatedState = '';
  updatedCity = '';
  updatedCountry = '';
  updatedZipcode = null;
  updatedFacebookID = '';
  updatedGooglePlus = '';
  updatedTwitter = '';
  updatedLinkedIn = '';
  updatedPhone = null;
  updatedTimezone = '';
  image_url = constant.imgurl;
  updatedTimezoneifnull = '';
  initialQuesData: any;

  requestParams = {
    'first_name': this.first_name,
    'last_name': this.last_name,
    'profile': {
      'avatar': this.imagePath,
      'address': this.updatedAddress,
      'city': this.updatedCity,
      'state': this.updatedState,
      'country': this.updatedCountry,
      'zipcode': this.updatedZipcode,
      'earnings_privacy': false,
      'facebook_id': this.updatedFacebookID,
      'google_plus_id': this.updatedGooglePlus,
      'twitter_id': this.updatedTwitter,
      'linkedin': this.updatedLinkedIn,
      'phone': this.updatedPhone,
      'user': this.queryUserID,
      'timezone': this.updatedTimezone
    }
  };

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private userService: UserService,
    private apiService: ApiService,
    private router: Router,
  ) {
    this.accountProfileForm = fb.group({
      'first_name': [null, Validators.compose([Validators.required])],
      'last_name': [null, Validators.compose([Validators.required])],
    });
    this.emailEditForm = fb.group({
      'email': [null, Validators.compose([Validators.required, Validators.email])],
    });
    this.phoneEditForm = fb.group({
      'phone': [null, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(15)])],
    });
    this.timezoneEditForm = fb.group({
      'timezone': [null, Validators.compose([Validators.required])],
    });
    this.addressEditForm = fb.group({
      'address': [null, Validators.compose([Validators.required])],
      'city': [null, Validators.compose([Validators.required])],
      'state': [null, Validators.compose([Validators.required])],
      'country': [null, Validators.compose([Validators.required])],
      'zipcode': [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(6)])],
    });
    this.iaddressEditForm = fb.group({
      'iaddress': [null, Validators.compose([Validators.required])],
      'icity': [null, Validators.compose([Validators.required])],
      'istate': [null, Validators.compose([Validators.required])],
      'icountry': [null, Validators.compose([Validators.required])],
      'izipcode': [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(6)])],
    });
  }

  ngOnInit() {
    console.log(this.image_url)
    localStorage.setItem('templog', '1');
    this.userService.sendHeaderLayout('layout2');
    if (localStorage.getItem('againreset') === '1') {
      this.getUserQuestion();
    }
    this.getUserProfile();
    this.userService.profileActives.subscribe(row => {
      this.activemenu = row;
    });
    this.getInvoiceAddress();
    this.getTimeZoneList();
  }

  checkboxmark(){
    if(this.iupdatedAddress == this.updatedAddress && this.iupdatedCity == this.updatedCity && this.iupdatedState == this.updatedState && this.iupdatedZipcode == this.updatedZipcode && this.iupdatedCountry == this.updatedCountry){
      this.icheck = 1;
    }else{
      this.icheck = 2;
    }
  }
  getTimeZoneList(){
    this.apiService.getRequest(constant.apiurl + constant.timeZoneList).subscribe(
      data => {
        this.timezoneResponse = data;
        this.timeZoneLists = this.timezoneResponse.body;
      }, err => {
        console.log(err);
      });
  }
  getInvoiceAddress() {
    this.apiService.getRequest(constant.apiurl + constant.invoiceAddress + '?user=' + this.queryUserID).subscribe(
      data => {
        this.invoiceAddressresult = data;
        if (this.invoiceAddressresult.body.count > 0) {
          this.invoiceAddressresult.results = this.invoiceAddressresult.body.results[0];
          this.iupdatedAddress = this.invoiceAddressresult.results.address;
          this.iupdatedCity = this.invoiceAddressresult.results.city;
          this.iupdatedZipcode = this.invoiceAddressresult.results.zipcode;
          this.iupdatedState = this.invoiceAddressresult.results.state;
          this.iupdatedCountry = this.invoiceAddressresult.results.country;
          this.showInvoiceAddr = true;
          this.iaddressEditForm.patchValue({
            'iaddress': this.iupdatedAddress,
            'icity': this.iupdatedCity,
            'istate': this.iupdatedState,
            'izipcode': this.iupdatedZipcode,
            'icountry': this.iupdatedCountry
          });
        }
      }, err => {
        console.log(err);
      });
  }

  getUserQuestion() {
    this.apiService.getRequest(constant.apiurl + constant.get_questionres + '?user=' + this.queryUserID).subscribe(
      data => {
        this.initialQuesData = data;
        if (this.initialQuesData.body.count > 0) {
          this.router.navigate(['security/password']);
        }
      }, err => {
        console.log(err);
      });
  }

  getUserProfile() {
    this.initialProfileDataTemp = '';
    this.apiService.getRequest(constant.apiurl + constant.get_user_details + this.queryUserID + '/').subscribe(
      data => {
        this.initialData = data;
        if (this.initialData.status === 200) {
          this.initialProfileData = this.initialData.body;
          this.initialProfileDataTemp = this.initialData.body;
          this.requestParams['first_name'] = this.first_name = this.initialProfileData.first_name;
          this.requestParams['last_name'] = this.last_name = this.initialProfileData.last_name;
          this.requestParams['email'] = this.initialProfileData.email;
          this.requestParams['profile']['avatar'] = this.imagePath = this.initialProfileData.profile.avatar;
          this.requestParams['profile']['address'] = this.updatedAddress = this.initialProfileData.profile.address;
          this.requestParams['profile']['city'] = this.updatedCity = this.initialProfileData.profile.city;
          this.requestParams['profile']['state'] = this.updatedState = this.initialProfileData.profile.state;
          this.requestParams['profile']['country'] = this.updatedCountry = this.initialProfileData.profile.country;
          this.requestParams['profile']['zipcode'] = this.updatedZipcode = this.initialProfileData.profile.zipcode;
          this.requestParams['profile']['facebook_id'] = this.updatedFacebookID = this.initialProfileData.profile.facebook_id;
          this.requestParams['profile']['google_plus_id'] = this.updatedGooglePlus = this.initialProfileData.profile.google_plus_id;
          this.requestParams['profile']['twitter_id'] = this.updatedTwitter = this.initialProfileData.profile.twitter_id;
          this.requestParams['profile']['updatedLinkedIn'] = this.updatedTwitter = this.initialProfileData.profile.linkedin;
          this.requestParams['profile']['phone'] = this.updatedPhone = this.initialProfileData.profile.phone;
          this.requestParams['profile']['timezone'] = this.updatedTimezone = this.initialProfileData.profile.timezone;
          if (this.updatedTimezone == null) {
            this.updatedTimezoneifnull = 'Pick your Timezone';
          }
          this.mail_address = this.initialProfileData.email;
          this.register_type = this.initialProfileData.profile.user_type;
          this.accountProfileForm.patchValue({
            'first_name': this.first_name,
            'last_name': this.last_name
          });
          this.emailEditForm.patchValue({
            'email': this.mail_address
          });
          this.phoneEditForm.patchValue({
            'phone': this.updatedPhone
          });
          this.addressEditForm.patchValue({
            'address': this.updatedAddress,
            'city': this.updatedCity,
            'state': this.updatedState,
            'zipcode': this.updatedZipcode
          });
        }

      }, err => {
        console.log(err);
      });
  }

  getUserProfileTemp(){
      this.requestParams['first_name'] = this.first_name = this.initialProfileDataTemp.first_name;
      this.requestParams['last_name'] = this.last_name = this.initialProfileDataTemp.last_name;
      this.requestParams['email'] = this.initialProfileDataTemp.email;
      this.requestParams['profile']['avatar'] = this.imagePath = this.initialProfileDataTemp.profile.avatar;
      this.requestParams['profile']['address'] = this.updatedAddress = this.initialProfileDataTemp.profile.address;
      this.requestParams['profile']['city'] = this.updatedCity = this.initialProfileDataTemp.profile.city;
      this.requestParams['profile']['state'] = this.updatedState = this.initialProfileDataTemp.profile.state;
      this.requestParams['profile']['country'] = this.updatedCountry = this.initialProfileDataTemp.profile.country;
      this.requestParams['profile']['zipcode'] = this.updatedZipcode = this.initialProfileDataTemp.profile.zipcode;
      this.requestParams['profile']['facebook_id'] = this.updatedFacebookID = this.initialProfileDataTemp.profile.facebook_id;
      this.requestParams['profile']['google_plus_id'] = this.updatedGooglePlus = this.initialProfileDataTemp.profile.google_plus_id;
      this.requestParams['profile']['twitter_id'] = this.updatedTwitter = this.initialProfileDataTemp.profile.twitter_id;
      this.requestParams['profile']['updatedLinkedIn'] = this.updatedTwitter = this.initialProfileDataTemp.profile.linkedin;
      this.requestParams['profile']['phone'] = this.updatedPhone = this.initialProfileDataTemp.profile.phone;
      this.requestParams['profile']['timezone'] = this.updatedTimezone = this.initialProfileDataTemp.profile.timezone;
      if (this.updatedTimezone == null) {
        this.updatedTimezoneifnull = 'Pick your Timezone';
      }
      this.mail_address = this.initialProfileDataTemp.email;
      this.register_type = this.initialProfileDataTemp.profile.user_type;
      this.accountProfileForm.patchValue({
        'first_name': this.first_name,
        'last_name': this.last_name
      });
      this.emailEditForm.patchValue({
        'email': this.mail_address
      });
      this.phoneEditForm.patchValue({
        'phone': this.updatedPhone
      });
      this.addressEditForm.patchValue({
        'address': this.updatedAddress,
        'city': this.updatedCity,
        'state': this.updatedState,
        'zipcode': this.updatedZipcode
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
  /* Account Profile Form Functionality - Start */
  accountClick() {
    this.displayAccountForm = true;
    this.getUserProfileTemp();
  }
  cancelAccountForm() {
    this.displayAccountForm = false;
    this.getUserProfileTemp();
  }
  accountProfileSubmit(formData) {
    this.errorAccountMsg = '';
    this.errorAccountMsgArr = [];
    const params = { 'first_name': formData.first_name, 'last_name': formData.last_name, 'profile': {} };
    if (this.accountProfileForm.valid) {
      this.apiService.putRequest(constant.apiurl + constant.get_user_details + this.queryUserID + '/', params).subscribe(
        data => {
          this.accountresult = data;
          if (this.accountresult.id != '') {
            this.first_name = this.accountresult.first_name;
            this.last_name = this.accountresult.last_name;
            this.displayAccountForm = false;
            this.userService.headerInfo(this.register_type);
          }
        }, err => {
          console.log(err);
        });
    } else {
      this.errorMsg = 'error';
    }
  }
  geterrorAccountMsg(field) {
    return this.accountProfileForm.controls[field].hasError('required') ? 'Field is required' : '';
  }
  /* Account Profile Form Functionality - End */
  /* Email Form Functionality - Start */
  emailEditClick() {
    this.displayEditForm = true;
    this.getUserProfileTemp();
  }
  cancelEmailEditForm() {
    this.displayEditForm = false;
    this.getUserProfileTemp();
  }
  emailEditSubmit(formData) {
    this.errorEmailMsg = '';
    this.errorEmailMsgArr = [];
    const params = { 'first_name': formData.first_name, 'last_name': formData.last_name, 'profile': {} };
    if (this.emailEditForm.valid) {

      if (formData.email.replace(/[^A-Z]/g, "").length !== 0){
        this.errorMsg = 'error';
        this.errorEmailMsgArr['email'] = ['Uppercase in email ID not Allowed'];
        this.errorEmailMsg = 'Uppercase in email ID not Allowed';
          return false;
      }
      this.requestParams['email'] = formData.email.toLowerCase();
      this.apiService.putRequest(constant.apiurl + constant.updateUserDetails + this.queryUserID + '/', this.requestParams).subscribe(
        data => {
          localStorage.removeItem('workplus_token');
          localStorage.removeItem('exp_token');
          this.userService.userlogin('guest');
          this.router.navigate(['/']);
          this.userService.snackMessage('Email Address updated, you need to login again');
        }, err => {
          this.errorEmailMsg = 'error';
          this.errorEmailMsgArr['email'] = err.error.email;
        });
    } else {
      this.errorEmailMsg = 'error';
    }
  }
  geterroreMailMsg(field) {
    return this.emailEditForm.controls[field].hasError('required') ? 'Field is required' :
      this.emailEditForm.controls[field].hasError('email') ? 'Please enter valid email address' : '';
  }
  /* Email Form Functionality - End */
  /* Edit Profile Image Functionality - start */
  editProfileImage() {
    const dialogRefimage = this.dialog.open(ProfileimageComponent, {
      disableClose: true,
      data: { first_name: this.first_name, last_name: this.first_name, imagePath: this.imagePath }
    });

    dialogRefimage.afterClosed().subscribe(result => {
      if (result != 'cancel') {
        this.requestParams['profile']['avatar'] = this.imagePath = result.imagePath;
        this.apiService.putRequest(constant.apiurl + constant.updateUserDetails + this.queryUserID + '/', this.requestParams).subscribe(
          data => {
            this.userService.snackMessage('Profile image updated');
            this.userService.headerInfo(this.register_type);

            this.userService.setEditProfileHeaderActive('password');
          }, err => {
            console.log(err);
          });
      }
    });
  }
  /* End Profile Image Functionality */
  // Phone edit functionality start
  phoneEditClick(event) {
    this.displayPhoneForm = true;
    this.phoneEditForm.patchValue({
      'timezone' : event
    });
    this.getUserProfileTemp();
  }
  cancelPhoneEditForm() {
    this.displayPhoneForm = false;
    this.getUserProfileTemp();
  }
  geterrorPhoneMsg(field) {
    return this.phoneEditForm.controls[field].hasError('required')
      || this.phoneEditForm.controls[field].hasError('minlength')
      || this.phoneEditForm.controls[field].hasError('maxlength') ? 'Please enter valid phone number' : '';
  }
  phoneEditSubmit(formData) {
    this.errorPhoneMsg = '';
    this.errorPhoneMsgArr = [];
    if (this.phoneEditForm.valid) {
      this.requestParams['profile']['phone'] = this.updatedPhone = formData.phone;
      this.apiService.putRequest(constant.apiurl + constant.updateUserDetails + this.queryUserID + '/', this.requestParams).subscribe(
        data => {
          this.phoneResult = data;
          // this.updatedPhone
          this.displayPhoneForm = false;
          this.userService.headerInfo(this.register_type);
          // this.getUserProfile();
        }, err => {
          console.log(err);
        });
    } else {
      this.errorPhoneMsg = 'error';
    }
  }
  // Phone edit functionality end
  // Timezone edit functionality start
  timezoneEditClick(event) {
    this.displaytimezoneForm = true;
    this.timezoneEditForm.patchValue({
      'timezone' : event
    });
    this.getUserProfileTemp();
  }
  cancelTimezoneEditForm() {
    this.displaytimezoneForm = false;
    this.getUserProfileTemp();
  }
  geterrorTimezoneMsg(field) {
    return this.timezoneEditForm.controls[field].hasError('required') ? 'Field is required' : '';
  }
  timezoneEditSubmit(formData) {
    this.errortimezoneMsg = '';
    this.errortimezoneMsgArr = [];
    if (this.timezoneEditForm.valid) {
      this.requestParams['profile']['timezone'] = this.updatedTimezone = formData.timezone;
      this.apiService.putRequest(constant.apiurl + constant.updateUserDetails + this.queryUserID + '/', this.requestParams).subscribe(
        data => {
          this.phoneResult = data;
          // this.updatedPhone
          this.displaytimezoneForm = false;
          this.userService.headerInfo(this.register_type);
          // this.getUserProfile();
        }, err => {
          console.log(err);
        });
    } else {
      this.errortimezoneMsg = 'error';
    }
  }
  // Timezone edit functionality end
  // Address edit functionality start
  addressEditClick(address,city,zip,state,country) {
    this.displayaddressForm = true;
    this.addressEditForm.patchValue({
      'address': address,
      'city': city,
      'state': state,
      'zipcode': zip,
      'country': country
    });
    this.getUserProfileTemp();
  }
  canceladdressEditForm() {
    this.displayaddressForm = false;
    this.getUserProfileTemp();
    
  }
  geterroraddressMsg(field) {
    if (field == 'zipcode' && (this.addressEditForm.controls[field].hasError('minlength') || this.addressEditForm.controls[field].hasError('maxlength'))) {
      return  'Please enter valid zip code';
    } else {
      return this.addressEditForm.controls[field].hasError('required') ? 'Field is required' : '';
    }
  }
  addressEditSubmit(formData) {
    this.erroraddressMsg = '';
    this.erroraddressMsgArr = [];
    if (this.addressEditForm.valid) {
      this.requestParams['profile']['address'] = this.updatedAddress = formData.address;
      this.requestParams['profile']['city'] = this.updatedCity = formData.city;
      this.requestParams['profile']['state'] = this.updatedState = formData.state;
      this.requestParams['profile']['country'] = this.updatedCountry = formData.country;
      this.requestParams['profile']['zipcode'] = this.updatedZipcode = formData.zipcode;
      this.apiService.putRequest(constant.apiurl + constant.updateUserDetails + this.queryUserID + '/', this.requestParams).subscribe(
        data => {
          this.phoneResult = data;
          // this.updatedPhone
          this.displayaddressForm = false;
          this.userService.headerInfo(this.register_type);
          this.getUserProfile();
        }, err => {
          console.log(err);
        });
    } else {
      this.erroraddressMsg = 'error';
    }
  }
  // Timezone edit functionality end
   // Invoice Address edit functionality start
   tempiaddress:any;
   invoiceaddressEditClick(address, city, zip, state, country) {
    this.checkboxmark();
    this.idisplayaddressForm = true;
    this.iaddressEditForm.patchValue({
      'iaddress': address,
      'icity': city,
      'istate': state,
      'izipcode': zip,
      'icountry': country
    });
    this.tempiaddress = {'address': address, 'city': city, 'zip': zip, 'state': state, 'country': country};
    this.getUserProfileTemp();
  }
  cancelinvoiceaddressEditForm() {
    this.idisplayaddressForm = false;
    this.iupdatedAddress = this.tempiaddress.address;
     this.iupdatedCity = this.tempiaddress.city;  
     this.iupdatedZipcode = this.tempiaddress.zip;
     this.iupdatedState = this.tempiaddress.state; 
    this.iupdatedCountry = this.tempiaddress.country; 
    // this.getUserProfileTemp();
  }
  geterrorinvoiceaddressMsg(field) {
    if (field == 'izipcode' && (this.iaddressEditForm.controls[field].hasError('minlength') || this.iaddressEditForm.controls[field].hasError('maxlength'))) {
      return  'Please enter valid zip code';
    } else {
      return this.iaddressEditForm.controls[field].hasError('required') ? 'Field is required' : '';
    }
  }
  invoiceaddressEditSubmit(formData) {
    this.ierroraddressMsg = '';
    this.ierroraddressMsgArr = [];
    if (this.iaddressEditForm.valid) {
      let params = {
        "address": formData.iaddress,
        "city": formData.icity,
        "zipcode": formData.izipcode,
        "state": formData.istate,
        "country": formData.icountry,
        "user": this.queryUserID
      };

      this.apiService.putRequest(constant.apiurl + constant.updateInvoice, params).subscribe(
        data => {
          this.invoiceAddressresult = data;
          this.iupdatedAddress = this.invoiceAddressresult.address;
          this.iupdatedCity = this.invoiceAddressresult.city;
          this.iupdatedZipcode = this.invoiceAddressresult.zipcode;
          this.iupdatedState = this.invoiceAddressresult.state;
          this.iupdatedCountry = this.invoiceAddressresult.country;
          this.showInvoiceAddr = true;
          this.idisplayaddressForm = false;
          this.getUserProfile();
        }, err => {
          console.log(err);
        });
    } else {
      this.ierroraddressMsg = 'error';
    }
  }
  onChangeInvoiceAddress(e) {
    if (!e) {
      //this.iaddressEditForm.patchValue({
      //  'iaddress': this.iupdatedAddress,
      //  'icity': this.iupdatedCity,
      //  'istate': this.iupdatedState,
      //  'izipcode': this.iupdatedZipcode,
      //  'icountry': this.iupdatedCountry
      //});
      this.iaddressEditForm.patchValue({
        'iaddress': '',
        'icity': '',
        'istate': '',
        'izipcode': '',
        'icountry': ''
      });
    } else {
      this.iaddressEditForm.patchValue({
        'iaddress': this.updatedAddress,
        'icity': this.updatedCity,
        'istate': this.updatedState,
        'izipcode': this.updatedZipcode,
        'icountry': this.updatedCountry
      });
    }
  }
  // Invoice Address edit functionality end
}
