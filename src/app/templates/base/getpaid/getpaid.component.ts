import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

import { constant, inputData } from '../../../../data/constant';
import { ApiService } from '../../../services/api/api.service';
import { UserService } from '../../../services/sync/user.service';
import { AddPaymentComponent } from './../getpaid/add-payment/add-payment.component';
import { PaymentScheduleComponent } from './../getpaid/payment-schedule/payment-schedule.component';
import { DeleteconfirmComponent } from './../postjob/deleteconfirm/deleteconfirm.component';

@Component({
  selector: 'app-getpaid',
  templateUrl: './getpaid.component.html',
  styleUrls: ['./getpaid.component.css']
})
export class GetpaidComponent implements OnInit {
  loggedUserId: any;
  getPaidData: any;
  isLoad: boolean = false;
  paymentMethods: any = [];
  paidAllow: boolean = false;
  delRes: any;
  priRes: any;
  scheduleData: any;
  scheduleType: any;
  nextPayment: any;
  minimumScheduleAmount:any;
  scRequiredAmount = inputData.scheduleRequired;
  scDisplayAmount:any;
  priResponse: any;
  primaryAccount: any;
  isPrimary: boolean = false;
  scheduledAdded:boolean = false;
  paymentmethoddisplay:any;
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private userService: UserService,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.userService.sendHeaderLayout('layout2');
    this.loggedUserId = this.apiService.decodejwts().userid;
    this.getPaidInfo();
    this.getPrimaryPayment();
  }

  getPaidInfo() {
    this.apiService.getRequest(constant.apiurl + constant.get_paid).subscribe(
      data => {
        if (data['status'] === 200 && data['ok'] === true) {
          this.getPaidData = data['body'];
          if(this.getPaidData.balance_amount === null){
            this.getPaidData.balance_amount = 0;
          }
          this.paymentMethods = this.getPaidData.payment_details.payment_methods;
          this.paidAllow = (this.getPaidData.balance_amount > 0) ? true : false;
          this.isLoad = true;
          this.scheduleData = this.getPaidData.payment_details.schedule;
          if (typeof this.scheduleData.schedule_type != 'undefined') {
            this.scheduleType = this.scheduleData.schedule_type;
            this.scheduledAdded = true;
          }
          if (typeof this.scheduleData.next_payment_date != 'undefined') {
            this.nextPayment = this.scheduleData.next_payment_date;
          }
          if (typeof this.scheduleData.require_balance_amount != 'undefined') {
            this.minimumScheduleAmount = this.scheduleData.require_balance_amount;
            const qIndex = this.scRequiredAmount.findIndex(x => x.key == this.minimumScheduleAmount);
            this.scDisplayAmount = this.scRequiredAmount[qIndex];
          }
        }
      }, err => {
        console.log(err);
      });
  }
  addPaymentMethod() {
    const dialogpayment = this.dialog.open(AddPaymentComponent, {
      disableClose: true,
      data: { 'type': 1 }
    });

    dialogpayment.afterClosed().subscribe(result => {
      if (result != 'cancel') {
        this.userService.snackMessage('Payment has been added successfully.');
        this.router.navigate(['get-paid']);
      }
    });
  }
  // delete Open job post
  deletePaymentSetup(paymentId) {
    const dialogRefimage = this.dialog.open(DeleteconfirmComponent, {
      disableClose: true,
      data: {}
    });
    dialogRefimage.afterClosed().subscribe(result => {
      if (result === 'confirm') {
          this.apiService.deleteRequest(constant.apiurl + constant.payment_setup + paymentId, {}).subscribe(
        res => {
          this.delRes = res;
          this.userService.snackMessage('Account has been deleted successfully.');
          // this.router.navigate(['get-paid']);
          this.getPaidInfo();
          this.getPrimaryPayment();
        });
      }
    });
  }
  
  setPrimaryPaymentSetup(paymentId) {
    this.apiService.getRequest(constant.apiurl + constant.primary_payment + '?id=' + paymentId).subscribe(
      res => {
        this.priRes = res;
        this.userService.snackMessage('Primary account has been changed successfully.');
        this.router.navigate(['get-paid']);
      },
      err => {
        console.log(err);
      });
  }
  paymentSchedule() {
    const dialogSchedule = this.dialog.open(PaymentScheduleComponent, {
      disableClose: true,
      data: { 'type': 'add', 'schedule': this.scheduleData }
    });

    dialogSchedule.afterClosed().subscribe(result => {
      if (result != 'cancel') {
        this.userService.snackMessage('Payment schedule has been updated successfully.');
        this.router.navigate(['get-paid']);
      }
    });
  }
  getPrimaryPayment() {
    this.apiService.getRequest(constant.apiurl + constant.payment_setup + '?user=' + this.loggedUserId + '&is_primary=true').subscribe(
      data => {
        this.priResponse = data['body'];
        if (this.priResponse.count > 0) {
          this.primaryAccount = this.priResponse.results[0];
          this.isPrimary = true;
        }
      }, err => {
        console.log(err);
      });
  }
  
  getpaidnow(){
   
    this.router.navigate(['/get-paid/getpaidnow']);

  }
}
