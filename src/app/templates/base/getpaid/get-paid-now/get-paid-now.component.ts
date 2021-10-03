import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../../../app/services/api/api.service';
import { constant, inputData } from '../../../../../data/constant';
import { GetpaidComponent } from '../getpaid.component';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
@Component({
  selector: 'app-get-paid-now',
  templateUrl: './get-paid-now.component.html',
  styleUrls: ['./get-paid-now.component.css']
})
export class GetPaidNowComponent implements OnInit {
  isAnonymous: boolean;
  loggedUserId: any;
  paymentmethoddisplay: any;
  availablebalanceinitial: any;
  initialQuesData: any;
  queryUserID = this.apiService.decodejwts().userid;
  constructor(private router: Router, private apiService: ApiService) { }
  
  ngOnInit() {
    localStorage.setItem('temp_path', 'get-paid/getpaidnow');
    if (localStorage.getItem('againreset') === '1') {
      this.getUserQuestion();
    } else {
      localStorage.setItem('temp_path', '');
    }
    this.isAnonymous = true;
    this.loggedUserId = this.apiService.decodejwts().userid;
    this.getpaymentmethodfunc();
    this.userbalance();
  }
  
  getpaid(getpaidform) {
    localStorage.setItem('wp_payment_method', getpaidform.value['paymentmethod']);
    localStorage.setItem('wp_payment', 'allow');
    this.router.navigate(['/get-paid/getpaidnow/mypayment']);
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
 
  getpaymentmethodfunc() {
    this.apiService.getRequest(constant.apiurl + constant.payment_setup + '?user=' + this.loggedUserId).subscribe(
      data => {
        if (data['status'] === 200 && data['ok'] === true) {
          this.paymentmethoddisplay = data['body'].results;
        }
      }, err => {
        console.log(err);
      });
  }
  userbalance() {
    this.apiService.getRequest(constant.apiurl + constant.clientView + this.loggedUserId + '/').subscribe(
      data => {
        if (data['status'] === 200 && data['ok'] === true) {
          let getwallet = data['body']['profile'].wallet_balance;
          if (getwallet === null) {
            this.availablebalanceinitial = 0;
          } else {
            this.availablebalanceinitial = getwallet;
          }
        }
      }, err => {
        console.log(err);
      });
  }
}
