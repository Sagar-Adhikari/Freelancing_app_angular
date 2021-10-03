import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, DefaultValueAccessor } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { country } from '../../../../../data/country';
import { timezone } from '../../../../../data/timezone';
import { constant } from '../../../../../data/constant';
import { ApiService } from '../../../../services/api/api.service';

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.css']
})
export class EditClientComponent implements OnInit {
  clientForm: FormGroup;
  isbuttondisable: boolean = false;
  ismessage: boolean = false;
  is_success: boolean = false;
  errormessage: string = "";
  results: any;
  first_name: String;
  last_name: String;
  mail_address: String;
  register_type: String;
  imagePath = '';
  locations: any = country.list;
  // timeZoneLists: any = timezone.list;
  timeZoneLists: any;
  timezoneResponse:any;
  updatedAddress = '';
  updatedState = '';
  updatedCity = '';
  updatedCountry = '';
  updatedZipcode = null;
  docurls = [];
  updatedFacebookID = '';
  updatedGooglePlus = '';
  updatedTwitter = '';
  updatedLinkedIn = '';
  updatedPhone = null;
  updatedTimezone = '';
  userStatus = 'Active';
  userVerify = 'False';
  image_url = constant.imgurl;
  queryUserID: any;
  initialData: any;
  initialProfileData: any;
  initialDocData: any;
  initialDocumentData: any;
  errorMsgArr: any;
  errorMsg = '';
  vat:any;
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
      'timezone': this.updatedTimezone,
      'vat': this.vat,
      'status':this.userStatus,
      'is_verified':(this.userVerify == 'False') ? false : true 
    }
  };
  constructor(formbuilder: FormBuilder, private apiService: ApiService, private router: Router,
    private titleService: Title,
    private route: ActivatedRoute) {
    this.clientForm = formbuilder.group({
      'first_name': [null, Validators.compose([Validators.required])],
      'last_name': [null, Validators.compose([Validators.required])],
      'email': [null, Validators.compose([Validators.required, Validators.email])],
      'phone' : [null, Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(10)])],
      'address': [null, Validators.compose([Validators.required])],
      'city': [null, Validators.compose([Validators.required])],
      'state': [null, Validators.compose([Validators.required])],
      'country': [null, Validators.compose([Validators.required])],
      'zipcode': [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(6)])],
      'timezone': [null, Validators.compose([Validators.required])],
      'vat' : [null, Validators.compose([Validators.required])],
      'user_status': [null, Validators.compose([Validators.required])],
      'user_verify': [null, Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {
    this.getUserProfile();
    this.getUserDocument();
    this.getTimeZoneList();
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

  getUserDocument() {
    this.apiService.getRequest(constant.apiurl + constant.getDocument + this.queryUserID+ '/').subscribe(
      data => {
        this.docurls = [];
        this.initialDocumentData = data;
        if (this.initialDocumentData.status === 200) {
          this.initialDocData = this.initialDocumentData.body;
          var files = this.initialDocData.files;
          var ids = this.initialDocData.file_id;
          for (let i = 0; i < files.length; i++) {
            if(files[i] != ''){
              var fileName = files[i].replace(/^.*[\\\/]/, '');
              var fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
              if(fileExtension == 'pdf'){
                var image = 'assets/images/pdf.png'; 
              }else if(fileExtension == 'doc' || fileExtension == 'docx'){
                var image = 'assets/images/doc.png'; 
              }else{
                var image = constant.imgurl + files[i];
              }
              
              this.docurls.push({
                'file': constant.imgurl + files[i],
                'image': image,
                'id': constant.apiurl + constant.deleteDocument + ids[i] + '/'
              });
            }
          }
        }
      }, err => {
        console.log(err);
      });
  }

  getUserProfile() {
    this.queryUserID = this.route.snapshot.paramMap.get('id');
    this.apiService.getRequest(constant.apiurl + constant.get_user_details + this.queryUserID + '/').subscribe(
      data => {
        this.initialData = data;
        if (this.initialData.status === 200) {
          this.initialProfileData = this.initialData.body;
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
          this.requestParams['profile']['vat'] = this.vat = this.initialProfileData.profile.vat;
          this.requestParams['profile']['status'] = this.userStatus = this.initialProfileData.profile.status;
          this.requestParams['profile']['is_verified'] = this.initialProfileData.profile.is_verified; 
          this.userVerify = ((this.initialProfileData.profile.is_verified) ? 'True' : 'False');
          this.mail_address = this.initialProfileData.email;
          this.register_type = this.initialProfileData.profile.user_type;
          this.clientForm.patchValue({
            'first_name': this.first_name,
            'last_name': this.last_name,
            'email': this.mail_address,
            'phone': this.updatedPhone,
            'address': this.updatedAddress,
            'city': this.updatedCity,
            'state': this.updatedState,
            'zipcode': this.updatedZipcode,
            'vat': this.vat,
            'user_status': this.userStatus,
            'user_verify': this.userVerify
          });

        }

      }, err => {
        console.log(err);
      });
  }
  clientFormSubmit(formData) {
    this.errorMsg = '';
    this.errorMsgArr = [];
    console.log('tessss');
    if (this.clientForm.valid) {
      console.log('itss valid');
      this.requestParams['first_name']= this.first_name = formData.first_name;
      this.requestParams['last_name']= this.last_name = formData.last_name;
      this.requestParams['email'] = this.mail_address = formData.email;
      this.requestParams['profile']['phone'] = this.updatedPhone = formData.phone;
      this.requestParams['profile']['address'] = this.updatedAddress = formData.address;
      this.requestParams['profile']['city'] = this.updatedCity = formData.city;
      this.requestParams['profile']['state'] = this.updatedState = formData.state;
      this.requestParams['profile']['country'] = this.updatedCountry = formData.country;
      this.requestParams['profile']['zipcode'] = this.updatedZipcode = formData.zipcode;
      this.requestParams['profile']['timezone'] = this.updatedTimezone = formData.timezone;
      this.requestParams['profile']['vat'] = this.vat = formData.vat;
      this.requestParams['profile']['status'] = this.userStatus = formData.user_status;
      this.requestParams['profile']['is_verified'] = ((formData.user_verify == 'False') ? false : true);
      this.userVerify = formData.user_verify;
      this.apiService.putRequest(constant.apiurl + constant.updateUserDetails + this.queryUserID + '/', this.requestParams).subscribe(
        data => {
          this.results = data;
          this.showSuccess();   
        }, error => {
          this.errormessage = error.error.non_field_errors["0"];
	        this.showError();
        });
    } else {
      this.errorMsg = 'error';
      // this.showError();
    }
  }
  showSuccess() {
    this.is_success = true;
    setTimeout(() => {
        this.router.navigate(['/admin/user-clients']);
        this.is_success = false;
      }, 1000);
  }

  showError() {
    this.isbuttondisable = true;
    this.ismessage = true;          
    setTimeout(() => {
      this.ismessage = false;
      this.isbuttondisable = false;
    }, 2000);       
  }
  geterrorMsg(field) {
    if (field === 'phone') {
      return this.clientForm.controls[field].hasError('required')
        || this.clientForm.controls[field].hasError('minlength')
        || this.clientForm.controls[field].hasError('maxlength') ? 'Please enter valid phone number' : '';
    } else if (field === 'zipcode') {
      return this.clientForm.controls[field].hasError('required')
        || this.clientForm.controls[field].hasError('minlength')
        || this.clientForm.controls[field].hasError('maxlength') ? 'Please enter valid zip code' : '';
    } else {
      return this.clientForm.controls[field].hasError('required') ? 'Field is required' : '';
    }
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

}
