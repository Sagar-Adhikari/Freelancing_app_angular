import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiService } from '../../../../../app/services/api/api.service';
import { constant, inputData } from '../../../../../data/constant';
import { empty } from '../../messages/utils/utils';
import { UserService } from '../../../../services/sync/user.service';
@Component({
  selector: 'app-get-paid-now-payment',
  templateUrl: './get-paid-now-payment.component.html',
  styleUrls: ['./get-paid-now-payment.component.css']
})
export class GetPaidNowPaymentComponent implements OnInit {
  paymentmethod: any;
  loggedUserId: any;
  userpaymentmethod: string = localStorage.getItem("wp_payment_method");
  networkplusfee: any;
  availablebalanceinitial: number;
  availablebalanceget: number;
  errorshow: string;
  paymentmethodvalue: string;
  payingmethod: string;
  constructor(private http: HttpClient, private router: Router, private apiService: ApiService,private userService: UserService) { }
  
  ngOnInit() {
    if (localStorage.getItem("wp_payment") === "allow") {
      this.loggedUserId = this.apiService.decodejwts().userid;
      this.getpaymentmethodfunc();
      this.userbalance();
    } else {
      this.router.navigate(['/get-paid/getpaidnow']);
    }
  }

  makepayment() {
  if(this.availablebalanceget == 0){
    this.errorshow = "Please enter value";
  }
    if ((this.errorshow !== 'partial value should not be greater than available balance') && (this.errorshow !== "not allowed") && (this.errorshow !== "Please enter value")) {
      let payment;
      if (this.userpaymentmethod.split('-')[0] === 'paypal') {
        payment = this.userpaymentmethod.replace(/^paypal-+/i, '');
      } else if (this.userpaymentmethod.split('-')[0] === 'bank') {
        payment = this.userpaymentmethod.replace(/^bank-+/i, '');
      }
      payment = this.userpaymentmethod.split('-')[0];
      let paymentdata = {
        "amount": this.availablebalanceget,
        "service_fee": this.networkplusfee,
        "user": this.loggedUserId,
        "type": payment
      }
      this.paymentrequestfunc(paymentdata);
    }
  }
  cancelpayment() {
    localStorage.setItem("wp_payment_method", '');
    localStorage.setItem("wp_payment", '');
    this.router.navigate(['/get-paid/']);
  }
  paymentmethodchange(event) {
    this.userpaymentmethod = event.value;
    this.getnetworkplusfeefunc();
  }
  availablebalancefunc() {
    let partialradiobutton = document.getElementById('partialamount');
    if (partialradiobutton.style.display === "block") {
      partialradiobutton.style.display = "none";
      this.availablebalanceget = this.availablebalanceinitial;
      this.errorshow = '';
    }
  }

  partialamountfunc() {
    this.availablebalanceget = this.availablebalanceinitial;
    let partialradiobutton = document.getElementById('partialamount');
    if (partialradiobutton.style.display === "none") {
      partialradiobutton.style.display = "block";
      (<HTMLInputElement>document.getElementById('par_amt')).value = '';
    }
  }

  partialpayment(event) {
    let amount: number = event.target.value;
    if (amount) {
      if (Number(amount) < Number(0)) {
        this.errorshow = "Not allowed";
        this.availablebalanceget = this.availablebalanceinitial;
      } else if (this.availablebalanceinitial > amount) {
        this.errorshow = '';
        this.availablebalanceget = amount;
      } else {
        this.errorshow = "Partial value should not be greater than or equal to available balance";
        this.availablebalanceget = this.availablebalanceinitial;
      }
    } else {
      this.errorshow = "Please enter value";
      this.availablebalanceget = this.availablebalanceinitial;
    }

  }
 
  paymentrequestfunc(paymentdata) {
    this.apiService.postRequest(constant.apiurl + constant.getWithdrawRequest, paymentdata).subscribe(
      data => {
        if (data) {
        this.userService.snackMessage('Payment Request Sent Successfully');
        this.router.navigate(['get-paid']);
          localStorage.setItem("wp_payment_method", '');
          localStorage.setItem("wp_payment", '');
          this.router.navigate(['/get-paid/']);
        }
      }, err => {
        this.userService.snackMessage(err['error'][0]);
        console.log(err['error'][0]);
      });
  }
  getpaymentmethodfunc() {
    this.apiService.getRequest(constant.apiurl + constant.payment_setup + '?user=' + this.loggedUserId).subscribe(
      data => {
        if (data['status'] === 200 && data['ok'] === true) {
          this.paymentmethod = data['body'].results;
        }
      }, err => {
        console.log(err);
      });
  }
  getnetworkplusfeefunc() {
    this.apiService.getRequest(constant.apiurl + constant.adminSettingsOptions).subscribe(
      data => {
        if (data['status'] === 200 && data['ok'] === true) {
          let checkbankorpaypal = this.userpaymentmethod.split('-')[0];
          if (checkbankorpaypal === "paypal") {
            this.payingmethod = "paypal";
            this.networkplusfee = data['body']['options'].withdraw_fee_paypal;
          } else if (checkbankorpaypal === "bank") {
            this.payingmethod = "bank";
            this.networkplusfee = data['body']['options'].withdraw_fee_bank;
          } else {
            this.networkplusfee = "error";
          }
        }
      }, err => {
        console.log(err);
      });
  }
  userbalance() {
    this.apiService.getRequest(constant.apiurl + constant.get_paid).subscribe(
      data => {
        if (data['status'] === 200 && data['ok'] === true) {
          let getwallet = data['body'].balance_amount;
          if (getwallet === null) {
            this.availablebalanceinitial = 0;
            this.availablebalanceget = this.availablebalanceinitial;

            this.getnetworkplusfeefunc();

          } else {
            this.availablebalanceinitial = getwallet;
            this.availablebalanceget = this.availablebalanceinitial;

            this.getnetworkplusfeefunc();
          }
        }
      }, err => {
        console.log(err);
      });
  }
}
