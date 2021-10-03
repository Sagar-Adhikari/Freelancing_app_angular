import { Component, OnInit } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { UserService } from '../../../services/sync/user.service';
import { ApiService } from '../../../services/api/api.service';
import { country } from '../../../../data/country';
import { timezone } from '../../../../data/timezone';
import { constant } from '../../../../data/constant';

import { ProfileimageComponent } from '../profileimage/profileimage.component';
import { RepeatsecurityComponent } from './repeatsecurity/repeatsecurity.component';

@Component({
  selector: 'app-profileedit',
  templateUrl: './profileedit.component.html',
  styleUrls: ['./profileedit.component.css']
})
export class ProfileeditComponent implements OnInit {
  activemenu;
  queryUserID: any = this.apiService.decodejwts().userid;
  initialData: any;
  initialProfileData: any;
  vat: String;
  first_name: String;
  last_name: String;
  mail_address: String;
  updatedDocument: String;
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
  icheck = 2;
  // Email Form - start
  emailEditForm: FormGroup;
  displayEditForm = false;
  // validation message display
  errorEmailMsg = '';
  errorEmailMsgArr: any;
  // Email Form - end

  // Document Form - start
  documentEditForm: FormGroup;
  displayDocumentEditForm = false;
  errorDocumentMsg = '';
  errorDocumentMsgArr: any;
  urls = [];
  docurls = [];
  multifile = [];
  initialDocumentData: any;
  initialDocData: any;
  // Document Form - end

  // Phone Form - start
  phoneEditForm: FormGroup;
  displayPhoneForm = false;
  errorPhoneMsg = '';
  errorPhoneMsgArr: any;
  phoneResult: any;
  // Phone Form - end
  // VAT Form - start
  vatEditForm: FormGroup;
  displayVATForm = false;
  errorVatMsg = '';
  errorVatMsgArr: any;
  vatResult: any;
  // VAT Form - end
  // Owner Form - start
  ownerEditForm: FormGroup;
  displayOwnerForm = false;
  errorOwnerMsg = '';
  errorOwnerArr: any;
  ownerResult: any;
  // Owner Form - end
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
  // invoice address Form - end
  // company Form - start
  companyEditForm: FormGroup;
  displayEditCompany = false;
  companyresult: any;
  companyTemp: any;
  company_id: any;
  company_name = "";
  company_website = "";
  company_tagline = "";
  company_description = "";
  // validation message display
  errorCompanyMsg = '';
  errorCompanyMsgArr: any;
  // company Form - end

  imagePath = '';
  updatedAddress = '';
  updatedState = '';
  updatedCity = '';
  updatedCountry = '';
  updatedZipcode = null;
  showInvoiceAddr = false;
  iupdatedAddress = '';
  iupdatedState = '';
  iupdatedCity = '';
  iupdatedCountry = '';
  loadiupdatedCountry = '';
  loadupdatedCountry = '';
  iupdatedZipcode = null;
  updatedFacebookID = '';
  updatedGooglePlus = '';
  updatedTwitter = '';
  updatedLinkedIn = '';
  updatedPhone = null;
  updatedVat = '';
  updatedTimezone = '';
  image_url = constant.imgurl;

  // security question popup display varaible declaration
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
      'timezone': this.updatedTimezone,
      'vat': this.updatedVat
    }
  };

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private userService: UserService,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {
    this.accountProfileForm = fb.group({
      'first_name': [null, Validators.compose([Validators.required])],
      'last_name': [null, Validators.compose([Validators.required])],
    });
    this.emailEditForm = fb.group({
      'email': [null, Validators.compose([Validators.required, Validators.email])],
    });
    this.documentEditForm = fb.group({
      'document': [null, Validators.compose([Validators.required])],
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
    this.companyEditForm = fb.group({
      'company_name': [this.company_name, Validators.compose([Validators.required])],
      'company_website': [this.company_website, Validators.compose([Validators.required])],
      'company_tagline': [this.company_tagline, Validators.compose([Validators.required])],
      'company_description': [this.company_description, Validators.compose([Validators.required])]
    });
    this.vatEditForm = fb.group({
      'vat': [null, Validators.compose([Validators.required])],
    });
    this.ownerEditForm = fb.group({
      'owner': [null, Validators.compose([Validators.required])],
    });
  }

  ngOnInit() {
    this.userService.sendHeaderLayout('layout2');
    this.getUserProfile();
    console.log(localStorage.getItem('againreset'));
    if (localStorage.getItem('againreset') === '1') {
      this.getUserQuestion();
    }
    this.userService.profileActives.subscribe(row => {
      this.activemenu = row;
    });
    this.getUserCompany();
    this.getInvoiceAddress();
    this.getTimeZoneList();
    this.getUserDocument();
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
          this.iupdatedCountry = this.loadiupdatedCountry = this.invoiceAddressresult.results.country;
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
          this.requestParams['profile']['country'] = this.updatedCountry = this.loadupdatedCountry = this.initialProfileData.profile.country;
          this.requestParams['profile']['zipcode'] = this.updatedZipcode = this.initialProfileData.profile.zipcode;
          this.requestParams['profile']['facebook_id'] = this.updatedFacebookID = this.initialProfileData.profile.facebook_id;
          this.requestParams['profile']['google_plus_id'] = this.updatedGooglePlus = this.initialProfileData.profile.google_plus_id;
          this.requestParams['profile']['twitter_id'] = this.updatedTwitter = this.initialProfileData.profile.twitter_id;
          this.requestParams['profile']['updatedLinkedIn'] = this.updatedTwitter = this.initialProfileData.profile.linkedin;
          this.requestParams['profile']['phone'] = this.updatedPhone = this.initialProfileData.profile.phone;
          this.requestParams['profile']['timezone'] = this.updatedTimezone = this.initialProfileData.profile.timezone;
          this.requestParams['profile']['vat'] = this.updatedVat = this.initialProfileData.profile.vat;
          this.mail_address = this.initialProfileData.email;
          this.updatedDocument = '';
          this.register_type = this.initialProfileData.profile.user_type;
          this.accountProfileForm.patchValue({
            'first_name': this.first_name,
            'last_name': this.last_name
          });
          this.emailEditForm.patchValue({
            'email': this.mail_address
          });
          this.documentEditForm.patchValue({
            'document': this.updatedDocument
          });
          this.phoneEditForm.patchValue({
            'phone': this.updatedPhone
          });
          this.vatEditForm.patchValue({
            'vat': this.updatedVat
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
  }
  cancelAccountForm() {
    this.displayAccountForm = false;
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
            // this.userService.headerInfo(this.register_type);
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
  }
  cancelEmailEditForm() {
    this.displayEditForm = false;
  }
  emailEditSubmit(formData) {
    this.errorEmailMsg = '';
    this.errorEmailMsgArr = [];
    const params = { 'first_name': formData.first_name, 'last_name': formData.last_name, 'profile': {} };
    if (this.emailEditForm.valid) {

      if(formData.email.replace(/[^A-Z]/g, "").length !== 0){
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

  /* Document Form Functionality - Start */
  documentEditClick() {
    this.displayDocumentEditForm = true;
  }
  cancelDocumentEditForm() {
    this.displayDocumentEditForm = false;
  }
  onSelectFile(event) {
    const fileTypeArray = ['png', 'jpeg', 'jpg', 'pdf', 'doc', 'docx']; // upload only png, jpeg & jpg
    this.urls = [];
    this.multifile = [];
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        this.errorDocumentMsg = '';
        this.errorDocumentMsgArr = [];
        var fileName = event.target.files[i].name;
        var fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
        if (fileTypeArray.some(x => x === fileExtension)) {
          if(fileExtension == 'pdf'){
            this.urls.push('assets/images/pdf.png'); 
          }else if(fileExtension == 'doc' || fileExtension == 'docx'){
            this.urls.push('assets/images/doc.png'); 
          }else{
            const fileReader: FileReader = new FileReader();
            //var reader = new FileReader();
            fileReader.onload = (event: Event) => {
              this.urls.push(fileReader.result); 
            }
            fileReader.readAsDataURL(event.target.files[i]);
          }
          this.multifile.push(event.target.files[i]);
        }else{
          this.errorDocumentMsg = 'error';
          this.errorDocumentMsgArr['document'] = 'Please upload valid files PNG, JPG, PDF and DOC ';
          break;
        }
      }
    }
  }
  documentDeleteSubmit(url) {
    if(confirm("Are you sure to delete ??")) {
      this.apiService.deleteRequest(url,'').subscribe(
      data => {
        this.getUserDocument();
      }, err => {
        this.errorDocumentMsg = 'error';
        this.errorDocumentMsgArr['document'] = err.error.document;
      });
    }
  }
  documentEditSubmit(formData) {
    this.errorDocumentMsg = '';
    this.errorDocumentMsgArr = [];
    const frmData = new FormData();
    if (this.documentEditForm.valid) {
      for (var i = 0; i < this.multifile.length; i++) { 
        frmData.append("file", this.multifile[i]);
      }
      frmData.append("user",this.queryUserID);
      this.apiService.postRequest(constant.apiurl + constant.uploadDocument, frmData).subscribe(
      data => {
        this.getUserDocument();
        this.cancelDocumentEditForm();
      }, err => {
        this.errorDocumentMsg = 'error';
        this.errorDocumentMsgArr['document'] = err.error.document;
      });
    } else {
      this.errorDocumentMsg = 'error';
    }
  }
  geterrordocumentMsg(field) {
    return this.documentEditForm.controls[field].hasError('required') ? 'Field is required' :
      this.documentEditForm.controls[field].hasError('document') ? 'Please upload document' : '';
  }
  /* Document Form Functionality - End */

  /* Edit Profile Image Functionality - start */
  editProfileImage() {
    const dialogRefimage = this.dialog.open(ProfileimageComponent, {
      disableClose: true,
      data: { first_name: this.first_name, last_name: this.first_name, imagePath: this.imagePath }
    });

    dialogRefimage.afterClosed().subscribe(result => {
      if (result != 'cancel') {
        this.requestParams['profile']['avatar'] = result.imagePath;
        this.imagePath = result.imagePath;
        this.apiService.putRequest(constant.apiurl + constant.updateUserDetails + this.queryUserID + '/', this.requestParams).subscribe(
          data => {
            this.userService.snackMessage('Profile image updated');
            // this.userService.headerInfo(this.register_type);

            this.userService.setEditProfileHeaderActive('password');
            this.userService.profileActives.subscribe(row => {
            });
          }, err => {
            console.log(err);
          });
      }
    });
  }
  /* End Profile Image Functionality */
  // Phone edit functionality start
  phoneEditClick() {
    this.displayPhoneForm = true;
  }
  cancelPhoneEditForm() {
    this.displayPhoneForm = false;
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
          // this.userService.headerInfo(this.register_type);
        }, err => {
          console.log(err);
        });
    } else {
      this.errorPhoneMsg = 'error';
    }
  }
  // Phone edit functionality end
  // Timezone edit functionality start
  timezoneEditClick() {
    this.displaytimezoneForm = true;
  }
  cancelTimezoneEditForm() {
    this.displaytimezoneForm = false;
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
          // this.userService.headerInfo(this.register_type);
        }, err => {
          console.log(err);
        });
    } else {
      this.errortimezoneMsg = 'error';
    }
  }
  // Timezone edit functionality end
  // Address edit functionality start
  addressEditClick() {
    this.displayaddressForm = true;
  }
  canceladdressEditForm() {
    this.displayaddressForm = false;
    this.updatedCountry = this.loadupdatedCountry;
    this.addressEditForm.patchValue({
      'address': this.updatedAddress,
      'city': this.updatedCity,
      'state': this.updatedState,
      'zipcode': this.updatedZipcode,
      'country': this.updatedCountry
    });
  }
  geterroraddressMsg(field) {
    if (field === 'zipcode') {
      return this.addressEditForm.controls[field].hasError('required')
        || this.addressEditForm.controls[field].hasError('minlength')
        || this.addressEditForm.controls[field].hasError('maxlength') ? 'Please enter valid zip code' : '';
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
          // this.userService.headerInfo(this.register_type);
        }, err => {
          console.log(err);
        });
    } else {
      this.erroraddressMsg = 'error';
    }
  }
  // Timezone edit functionality end

  // Invoice Address edit functionality start
  invoiceaddressEditClick() {
    if(this.iupdatedAddress == this.updatedAddress && this.iupdatedCity == this.updatedCity && this.iupdatedState == this.updatedState && this.updatedZipcode == this.iupdatedZipcode && this.iupdatedCountry == this.updatedCountry){
      this.icheck = 1;
    }else{
      this.icheck = 2;
    }
    this.idisplayaddressForm = true;
  }
  cancelinvoiceaddressEditForm() {
    this.idisplayaddressForm = false;
    this.iupdatedCountry = this.loadiupdatedCountry;
    this.iaddressEditForm.patchValue({
      'iaddress': this.iupdatedAddress,
      'icity': this.iupdatedCity,
      'istate': this.iupdatedState,
      'izipcode': this.iupdatedZipcode,
      'icountry': this.iupdatedCountry
    });
  }
  geterrorinvoiceaddressMsg(field) {
    if (field === 'izipcode') {
      return this.iaddressEditForm.controls[field].hasError('required')
        || this.iaddressEditForm.controls[field].hasError('minlength')
        || this.iaddressEditForm.controls[field].hasError('maxlength') ? 'Please enter valid zip code' : '';
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
        }, err => {
          console.log(err);
        });
    }else {
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
  //company edit START
  companyEditClick() {
    this.companyFormReset();
    this.displayEditCompany = true;
  }
  companyFormReset() {
    this.companyEditForm.setValue({ company_name: this.company_name, company_website: this.company_website, company_tagline: this.company_tagline, company_description: this.company_description });
  }

  cancelCompanyEditForm() {
    this.displayEditCompany = false;
  }
  companyAddSave(formData) {
    // console.log(formData);
    this.errorCompanyMsg = '';
    this.errorCompanyMsgArr = [];
    const params = { 
      'user': this.queryUserID,
      'name': formData.company_name,
      'website': formData.company_website,
      'tag_line': formData.company_tagline, 
      'description': formData.company_description
     };
    if (this.companyEditForm.valid) {
      this.apiService.postRequest(constant.apiurl + constant.clientCompany, params).subscribe(
        data => {
          this.companyTemp = data;
          if (this.companyresult.id != '') {
            this.company_name = this.companyTemp.name;
            this.company_website = this.companyTemp.website;
            this.company_tagline = this.companyTemp.tag_line;
            this.company_description = this.companyTemp.description;
            this.displayEditCompany = false;
            this.companyFormReset();
            // this.userService.headerInfo(this.register_type);
          }
        }, err => {
          this.snackBar.open(err.error.website[0], 'OK', {
            verticalPosition: 'top',
            horizontalPosition: 'center',
          });
          setTimeout(() => {
            this.snackBar.dismiss();
          }, 1500); 
        });
    } else {
      this.errorCompanyMsg = 'error';
    }
  }
  companyEditSubmit(formData) {
    this.errorCompanyMsg = '';
    this.errorCompanyMsgArr = [];
    const params = { 
      'user': this.queryUserID, 
      'name': formData.company_name,
      'website': formData.company_website,
      'tag_line': formData.company_tagline, 
      'description': formData.company_description
     };
    if (this.companyEditForm.valid) {
      this.apiService.putRequest(constant.apiurl + constant.clientCompany + this.company_id + '/', params).subscribe(
        data => {
          this.companyTemp = data;
          if (this.companyresult.id !== '') {
            this.company_name = this.companyTemp.name;
            this.company_website = this.companyTemp.website;
            this.company_tagline = this.companyTemp.tag_line;
            this.company_description = this.companyTemp.description;
            this.displayEditCompany = false;
            this.companyFormReset();
            // this.userService.headerInfo(this.register_type);
          }
        }, err => {
            this.snackBar.open(err.error.website[0], 'OK', {
              verticalPosition: 'top',
              horizontalPosition: 'center',
            });
            setTimeout(() => {
              this.snackBar.dismiss();
            }, 1500); 
            });
    } else {
      this.errorCompanyMsg = 'error';
    }
  }
  geterrorCompanyMsg(field) {
    return this.companyEditForm.controls[field].hasError('required') ? 'Field is required' : '';
  }
  getUserCompany() {
    this.apiService.getRequest(constant.apiurl + constant.clientCompany + '?user=' + this.queryUserID).subscribe(
      data => {
        this.companyresult = data;
        if (this.companyresult.body.results.length > 0) {
          this.companyresult.results = this.companyresult.body.results[0];
          this.company_id = this.companyresult.results.id;
          this.company_name = this.companyresult.results.name;
          this.company_website = this.companyresult.results.website;
          this.company_tagline = this.companyresult.results.tag_line;
          this.company_description = this.companyresult.results.description;
        }
      }, err => {
        console.log(err);
      });
  }
  //company edit END
  // VAT ID START
  vatFormReset() {
    this.vatEditForm.setValue({ vat: this.updatedVat });
  }
  vatEditClick() {
    this.vatFormReset();
    this.displayVATForm = true;
  }
  vatEditSubmit(formData) {
    this.errorVatMsg = '';
    this.errorVatMsgArr = [];
    if (this.vatEditForm.valid) {
      this.requestParams['profile']['vat'] = this.updatedVat = formData.vat;
      this.apiService.putRequest(constant.apiurl + constant.updateUserDetails + this.queryUserID + '/', this.requestParams).subscribe(
        data => {
          this.vatResult = data;
          // this.updatedPhone
          this.displayVATForm = false;
          // this.userService.headerInfo(this.register_type);
        }, err => {
          console.log(err);
        });
    } else {
      this.errorVatMsg = 'error';
    }
  }
  cancelVatEditForm() {
    this.displayVATForm = false;
  }
  geterrorVatMsg(field) {
    return this.vatEditForm.controls[field].hasError('required') ? 'Field is required' : '';
  }
  // VAT ID END
  // Owner START
  ownerEditClick() {
    this.displayOwnerForm = true;
  }
  ownerEditSubmit(formData) {
    this.errorOwnerMsg = '';
    this.errorOwnerArr = [];
    console.log(formData);
    this.displayOwnerForm = false;
  }
  cancelOwnerEditForm() {
    this.displayOwnerForm = false;
  }
  geterrorOwnerMsg(field) {
    return this.ownerEditForm.controls[field].hasError('required') ? 'Field is required' : '';
  }
  //Owner END

}
