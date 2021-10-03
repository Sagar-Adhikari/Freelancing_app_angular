import { Component, OnInit, Inject } from '@angular/core';
import { Title, Meta, DOCUMENT } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { FileUploader } from 'ng2-file-upload'; // file upload
import { ApiService } from '../../services/api/api.service';
import { constant, inputData } from '../../../data/constant';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  resGetSiteDetails: any;
  application_name = '';
  email = '';
  logo_url = '';
  favi_url = '';
  fav_icon_url = '';
  updated_logo_url = '';
  updated_favi_url = '';
  use_logo_url = '';
  use_favi_url = '';
  user_id: string = this.apiservice.decodejwts().userid;
  withdrawOptions: any = inputData.withdrawOption;
  withdrawSymbol: any = inputData.withdrawSymbol;
  defaultWithdraw: any;
  // To create the form object variable
  generalForm: FormGroup;

  // error & success message variable are created here
  ismessage = false;
  is_success = false;
  isbuttondisable = false;
  errormessage: string;
  iswmessage: boolean = false;
  errorBankMsg: any = '';
  errorPaypalMsg: any = '';
  // This uploader function using for site logo file upload
  public uploader: FileUploader = new FileUploader({
    url: constant.apiurl + constant.fileupload,
    headers: [{
      name: 'Authorization',
      value: this.authHeader
    }],
    additionalParameter: {
      user: this.user_id,
      type: 'Desktop'
    }
  });
  // This faviuploader function using for favi-icon file upload
  public faviuploader: FileUploader = new FileUploader({
    url: constant.apiurl + constant.fileupload,
    headers: [{
      name: 'Authorization',
      value: this.authHeader
    }],
    additionalParameter: {
      user: this.user_id,
      type: 'Desktop'
    }
  });
  public get authHeader(): string {
    return `JWT ${localStorage.getItem('exp_token')}`;
  }
  constructor(
    formbuilder: FormBuilder,
    public apiservice: ApiService,
    private snackBar: MatSnackBar,
    public sanitizer: DomSanitizer,
    private titleService: Title,
    @Inject(DOCUMENT) private document: HTMLDocument,
  ) {
    this.generalForm = formbuilder.group({
      'connects': [null, Validators.compose([Validators.required])],
      'application_name': [null, Validators.compose([Validators.required])],
      'email': [null, Validators.compose([Validators.required])],
      'withdraw_option': [null, Validators.compose([Validators.required])],
      'withdraw_fee_bank': [null, Validators.compose([Validators.required, Validators.pattern(/^[.\d]+$/)])],
      'withdraw_fee_paypal': [null, Validators.compose([Validators.required, Validators.pattern(/^[.\d]+$/)])]
    });
  }

  ngOnInit() {
    this.getGeneralData();
    this.uploader.onAfterAddingFile = (fileItem) => {
      console.log(fileItem);
      let url = (window.URL) ? window.URL.createObjectURL(fileItem._file) : (window as any).webkitURL.createObjectURL(fileItem._file);
      const fileTypeArray = ['png', 'jpeg', 'jpg'];
      var fileName = fileItem.file.name;
      var fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
      if (fileTypeArray.some(x => x === fileExtension)) {
        this.logo_url = url;
        fileItem.withCredentials = false;
        fileItem.upload();
      }else{
        this.errormessage = 'Image type not supported';
        this.showError();
      }
    };

    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      var responsePath = JSON.parse(response);
      if (responsePath.status == 'false' && responsePath.errors == 'image type not supported') {
        this.errormessage = 'Image type not supported';
        this.showError();
      } else {
        this.updated_logo_url = responsePath.file;
      }
    };
    this.faviuploader.onAfterAddingFile = (fileItem) => {
      let url = (window.URL) ? window.URL.createObjectURL(fileItem._file) : (window as any).webkitURL.createObjectURL(fileItem._file);
      const fileTypeArray = ['png', 'jpeg', 'jpg', 'ico'];
      var fileName = fileItem.file.name;
      var fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
      if (fileTypeArray.some(x => x === fileExtension)) {
        this.favi_url = url;
        fileItem.withCredentials = false;
        fileItem.upload();
      }else{
        this.errormessage = 'Image type not supported';
        this.showError();
      }
    };

    this.faviuploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      var responsePath = JSON.parse(response);
      if (responsePath.status == 'false' && responsePath.errors == 'image type not supported') {
        this.errormessage = 'Image type not supported';
        this.showError();
      } else if (responsePath.status == 'false') {
        this.errormessage = '';
        responsePath.errors.forEach(item => {
          if (item['0'] != '' && typeof item['0'] != 'undefined') {
            this.errormessage += item['0'] + '<br/>';
          }
        });
        this.favi_url = this.fav_icon_url;
        this.showError();
      } else {
        this.updated_favi_url = responsePath.file;
      }
    };
  }

  // ngAfterViewChecked(){
  //   if (this.app.page_app_name != '' && typeof this.app.page_app_name != 'undefined') {
  //     this.titleService.setTitle( this.app.page_app_name+' | Site Settings' );
  //   }
  // }
  /**  To prepopuldate the site setting form input fields */
  getGeneralData() {
    const getSiteDetailsUrl = constant.apiurl + constant.adminSettingsOptions;
    this.apiservice.getRequest(getSiteDetailsUrl).subscribe(
      result => {
        this.resGetSiteDetails = result;
        if (this.resGetSiteDetails.status === 200 && this.resGetSiteDetails.ok === true) {
          if (typeof this.resGetSiteDetails.body.options.connect != 'undefined')
            this.generalForm.controls['connects'].setValue(this.resGetSiteDetails.body.options.connect);
          if (typeof this.resGetSiteDetails.body.options.application_name != 'undefined')
            this.generalForm.controls['application_name'].setValue(this.resGetSiteDetails.body.options.application_name);
          if (typeof this.resGetSiteDetails.body.options.email != 'undefined')
            this.generalForm.controls['email'].setValue(this.resGetSiteDetails.body.options.email);
          if (typeof this.resGetSiteDetails.body.options.withdraw_option != 'undefined') {
            this.generalForm.controls['withdraw_option'].setValue(this.resGetSiteDetails.body.options.withdraw_option);
            this.defaultWithdraw = this.resGetSiteDetails.body.options.withdraw_option;
          }
          if (typeof this.resGetSiteDetails.body.options.withdraw_fee_bank != 'undefined')
            this.generalForm.controls['withdraw_fee_bank'].setValue(this.resGetSiteDetails.body.options.withdraw_fee_bank);
          if (typeof this.resGetSiteDetails.body.options.withdraw_fee_paypal != 'undefined')
            this.generalForm.controls['withdraw_fee_paypal'].setValue(this.resGetSiteDetails.body.options.withdraw_fee_paypal);

          this.logo_url = constant.imgurl + this.resGetSiteDetails.body.options.frontend_logo;
          this.favi_url = constant.imgurl + this.resGetSiteDetails.body.options.fav_icons;
          this.fav_icon_url = this.favi_url = constant.imgurl + this.resGetSiteDetails.body.options.fav_icons;
          this.use_logo_url = this.resGetSiteDetails.body.options.frontend_logo;
          this.use_favi_url = this.resGetSiteDetails.body.options.fav_icons;
          //this.document.getElementById('app_title').innerHTML = this.application_name;
          //this.document.getElementById('appFavicon').setAttribute('href', constant.imgurl + this.resGetSiteDetails.body.options.fav_icons);
          this.document.getElementById('appLogo').setAttribute('href', constant.imgurl + this.resGetSiteDetails.body.options.frontend_logo);
          localStorage.setItem('workplus_logo', constant.imgurl + this.resGetSiteDetails.body.options.frontend_logo);
          localStorage.setItem('workplus_appname', this.application_name);
          this.titleService.setTitle(this.application_name);
          localStorage.setItem('workplus_favicon', constant.imgurl + this.resGetSiteDetails.body.options.fav_icons);
        }
      }, err => {
        // To show the error alert message for unwanted error's
        this.snackBar.open('Something went wrong, Please try again later.', '', {
          duration: 2000
        });
      });
  }
  /**  This function is used for form submission, data send to the API and sussess message display */
  generalFormSubmit(formData) {
    if (this.generalForm.valid) {
      // Logo & Favi image are required field, here we validate and display the notification
      if (this.logo_url === '' || this.favi_url === '') {
        this.getFormMessage();
        this.showError();
      } else {
        this.updated_logo_url = this.updated_logo_url == '' ? this.use_logo_url : this.updated_logo_url;
        this.updated_favi_url = this.updated_favi_url == '' ? this.use_favi_url : this.updated_favi_url;
        const href = constant.apiurl + constant.adminSettingsOptions;
        if (formData.withdraw_option == 'percentage') {
          if (formData.withdraw_fee_bank < 0 || formData.withdraw_fee_bank > 100) {
            this.iswmessage = true;
            this.errorBankMsg = 'Invalid Withdraw Bank fee %';
            return false;
          }else {
            this.errorBankMsg = "";
          }
          if (formData.withdraw_fee_paypal < 0 || formData.withdraw_fee_paypal > 100) {
            this.errorPaypalMsg = 'Invalid Withdraw Paypal fee %';
            this.iswmessage = true;
            return false;
          }else{
            this.errorPaypalMsg = "";
          }
        }
        var params = {
          'key': {
            'connect': formData.connects,
            'application_name': formData.application_name,
            'email': formData.email,
            'fav_icons': this.updated_favi_url,
            'frontend_logo': this.updated_logo_url,
            'withdraw_option': formData.withdraw_option,
            'withdraw_fee_bank': formData.withdraw_fee_bank,
            'withdraw_fee_paypal': formData.withdraw_fee_paypal
          }
        };
        console.log(params);
        this.apiservice.putRequest(href, params).subscribe(
          data => {
            this.showSuccess();
            // singleton update
            this.document.getElementById('appFavicon').setAttribute('href', constant.imgurl + this.updated_favi_url);
            this.document.getElementById('appLogo').setAttribute('src', constant.imgurl + this.updated_logo_url);
            localStorage.setItem('workplus_logo', constant.imgurl + this.updated_logo_url);
            localStorage.setItem('workplus_appname', formData.application_name);
            this.titleService.setTitle(this.application_name);
            localStorage.setItem('workplus_favicon', constant.imgurl + this.updated_favi_url);
            // this.document.getElementById('app_title').innerHTML = formData.application_name;
          });
      }
    } else {
      this.getFormMessage();
      this.showError();
    }
  }
  /* show&hide the success message notification in form submission */
  showSuccess() {
    this.getGeneralData();
    this.is_success = true;
    setTimeout(() => {
      this.is_success = false;
    }, 2000);
  }
  /* show&hide the error message notification in form submission */
  showError() {
    this.isbuttondisable = true;
    this.ismessage = true;
    setTimeout(() => {
      this.ismessage = false;
      this.isbuttondisable = false;
    }, 2000);
  }
  /** To create the form required validation message */
  getFormMessage() {
    if (this.generalForm.controls['application_name'].hasError('required') || this.generalForm.controls['email'].hasError('required')
      || this.generalForm.controls['connects'].hasError('required')
      || this.generalForm.controls['withdraw_fee_bank'].hasError('required')
      || this.generalForm.controls['withdraw_fee_paypal'].hasError('required')
      || this.generalForm.controls['withdraw_option'].hasError('required')
    ) {
      this.errormessage = 'Fields are required';
    } else if (this.generalForm.controls['email'].hasError('email')) {
      this.errormessage = 'Invalid email';
    } else if (this.logo_url === '' || this.favi_url === '') {
      this.errormessage = 'Application logo is required';
      if (this.favi_url === '') {
        this.errormessage = 'Application favi icon is required';
      }
    }
  }
  /** numberOnly function using for input field only can enter number character functionality */
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  fileSelected(e) {
  }

}
