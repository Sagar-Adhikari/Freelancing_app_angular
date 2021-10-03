import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { constant } from '../../../../../data/constant';
import { ApiService } from '../../../../services/api/api.service';
import { UserService } from '../../../../services/sync/user.service';
import { country } from '../../../../../data/country';

@Component({
  selector: 'app-setup-bank',
  templateUrl: './setup-bank.component.html',
  styleUrls: ['./setup-bank.component.css']
})
export class SetupBankComponent implements OnInit {
  loggedUserId: any;
  ifsc_code: any;
  isGetBank: boolean = false;
  bankInfo: any;
  setupBankForm: FormGroup;
  withdraw_option = localStorage.getItem('wp_withdraw_option');
  withdraw_fee_bank = localStorage.getItem('wp_withdraw_fee_bank');
  // validation message display
  errorMsg = '';
  errorMsgArr: any = [];
  locations: any = country.list;
  isbuttondisable: boolean = false;
  is_success: boolean = false;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService,
    private apiService: ApiService
  ) {
    this.setupBankForm = fb.group({
      'ifsc_code': [this.ifsc_code, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'account_number': ['', Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'account_name': ['', Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'address': ['', Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'city': ['', Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'country': ['', Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'phone_number': ['', Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'terms': [false, Validators.compose([Validators.requiredTrue])],
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true }
  }
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(event) {
    return false;
  }
  ngOnInit() {
    this.loggedUserId = this.apiService.decodejwts().userid;
  }
  getBankUsingIfsc() {
    this.errorMsg = '';
    this.errorMsgArr = [];
    this.errorMsgArr['ifsc_code'] = '';
    if (this.ifsc_code !== '') {
      this.apiService.getRequest(constant.apiurl + constant.get_bank_usingIfsc + '?code=' + this.ifsc_code).subscribe(
        data => {
          if (data['status'] === 200 && data['ok'] === true) {
            if (data['body'].error != undefined && data['body'].error != "") {
              this.errorMsg = 'error';
              this.errorMsgArr['ifsc_code'] = data['body'].error;
            } else {
              this.errorMsg = '';
              this.errorMsgArr = [];
              this.bankInfo = data['body'];
              this.isGetBank = true;
            }
          }
        }, err => {
          console.log(err);
        });
    } else {
      this.errorMsg = 'error';
      this.errorMsgArr['ifsc_code'] = 'You must enter a value';
    }
  }
  geterrorMsg(field) {
    return this.setupBankForm.controls[field].hasError('required') || this.setupBankForm.controls[field].hasError('whitespace') ? 'You must enter a value' : '';
  }
  setupBankFormSubmit(formData: any) {
    this.errorMsg = '';
    this.errorMsgArr = [];
    if (this.setupBankForm.valid) {
      let iParams = {
        "payment_method": "bank",
        "ifsc_code": formData.ifsc_code,
        "bank_name": this.bankInfo.BANK,
        "bank_branch": this.bankInfo.BRANCH,
        "bank_address": this.bankInfo.ADDRESS + ', ' + this.bankInfo.CITY + ', ' + this.bankInfo.STATE,
        "bank_country": formData.country,
        "currency": "INR",
        "account_number": formData.account_number,
        "account_name": formData.account_name,
        "address": formData.address,
        "city": formData.city,
        "country": formData.country,
        "phone_number": formData.phone_number,
        "paypal_email": "",
        "user": this.loggedUserId
      }
      this.apiService.postRequest(constant.apiurl + constant.payment_setup, iParams).subscribe(
        row => {
          this.showSuccess();
          this.userService.snackMessage('Bank Payment has been saved successfully.');
          this.router.navigate(['/get-paid']);
        }, err => {
          console.log(err);
          this.errorMsg = 'error';
        });

    } else {
      this.errorMsg = 'error';
    }
  }
  showSuccess() {
    this.is_success = true;
    setTimeout(() => {
      this.is_success = false;
    }, 2000);
  }

  onCancel() {
    this.router.navigate(['/get-paid']);
  }
}
