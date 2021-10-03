import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { constant } from '../../../../../data/constant';
import { ApiService } from '../../../../services/api/api.service';
import { UserService } from '../../../../services/sync/user.service';
@Component({
  selector: 'app-setup-paypal',
  templateUrl: './setup-paypal.component.html',
  styleUrls: ['./setup-paypal.component.css']
})
export class SetupPaypalComponent implements OnInit {
  loggedUserId: any;
  setupPaypalForm: FormGroup;
  withdraw_option = localStorage.getItem('wp_withdraw_option');
  withdraw_fee_paypal = localStorage.getItem('wp_withdraw_fee_paypal');
  // validation message display
  errorMsg = '';
  errorMsgArr: any = [];
  isbuttondisable: boolean = false;
  is_success: boolean = false;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService,
    private apiService: ApiService
  ) {
    this.setupPaypalForm = fb.group({
      'paypal_email': ['', Validators.compose([Validators.required])]
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(event) {
    return false;
  }
  ngOnInit() {
    this.loggedUserId = this.apiService.decodejwts().userid;
  }
  geterrorMsg(field) {
    return this.setupPaypalForm.controls[field].hasError('required') ? 'You must enter a value' : '';
  }
  setupPaypalFormSubmit(formData: any) {
    this.errorMsg = '';
    this.errorMsgArr = [];
    if (this.setupPaypalForm.valid) {
      let iParams = {
        "payment_method": "paypal",
        "paypal_email": formData.paypal_email,
        "user": this.loggedUserId
      }
      this.apiService.postRequest(constant.apiurl + constant.payment_setup, iParams).subscribe(
        row => {
          this.showSuccess();
          this.userService.snackMessage('Paypal Payment has been saved successfully.');
          this.router.navigate(['/get-paid']);
        }, err => {
          console.log(err);
          this.errorMsgArr['paypal_email'] = err.error[0];
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
