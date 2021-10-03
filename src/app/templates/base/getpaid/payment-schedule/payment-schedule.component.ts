import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ApiService } from '../../../../services/api/api.service';
import { UserService } from '../../../../services/sync/user.service';

import { constant, inputData } from '../../../../../data/constant';
import * as moment from 'moment'

@Component({
  selector: 'app-payment-schedule',
  templateUrl: './payment-schedule.component.html',
  styleUrls: ['./payment-schedule.component.css']
})
export class PaymentScheduleComponent implements OnInit {
  withdraw_option = localStorage.getItem('wp_withdraw_option');
  withdraw_fee_bank = localStorage.getItem('wp_withdraw_fee_bank');
  withdraw_fee_paypal = localStorage.getItem('wp_withdraw_fee_paypal');
  loggedUserId: any;
  priResponse: any;
  primaryAccount: any;
  isPrimary: boolean = false;
  paymentScheduleForm: FormGroup;
  scheduleTypes: any = [];
  defaultType: any = '';
  tempRes: any;
  isbuttondisable: boolean = false;
  next_payment: any = '';
  displayNextPayment: any = '';
  currentYear: any;
  scRequiredAmount = inputData.scheduleRequired;
  defaultBalance: any;
  // validation message display
  errorMsg = '';
  errorMsgArr: any = [];
  is_success: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) private getdata: any,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<PaymentScheduleComponent>,
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private apiService: ApiService
  ) {
    this.paymentScheduleForm = fb.group({
      'schedule_type': ['', Validators.compose([Validators.required])],
      'require_balance_amount': ['', Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {
    this.currentYear = moment().format('YYYY');
    this.loggedUserId = this.apiService.decodejwts().userid;
    if (typeof this.getdata.schedule.schedule_type != 'undefined') {
      this.defaultType = this.getdata.schedule.schedule_type;
      this.defaultBalance = this.getdata.schedule.require_balance_amount;
      this.next_payment = this.getdata.schedule.next_payment_date;
      this.displayNextPayment = moment(this.next_payment).format("MMM DD, YYYY");
    }
    this.getPrimaryPayment();
    this.getScheduleList();
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
  getScheduleList() {
    this.apiService.getRequest(constant.apiurl + constant.payment_schedule).subscribe(
      data => {
        this.tempRes = data['body'];
        if (this.tempRes.count > 0) {
          this.scheduleTypes = this.tempRes.results;
        }
      }, err => {
        console.log(err);
      });
  }
  onchangeSchedule(iSchedule: any) {
    let sinfo = JSON.parse(iSchedule.information);
    let today = moment().format('YYYY-MM-DD');
    if (iSchedule.schedule_type == 'Quaterly') { //Mar 25
      let calDate = moment().month(sinfo.month).date(sinfo.date).year(this.currentYear).format('YYYY-MM-DD');
      this.next_payment = (today >= calDate) ? moment(calDate).add(1, 'years') : calDate;
      this.displayNextPayment = moment(this.next_payment).format("MMM DD, YYYY");
    }
    if (iSchedule.schedule_type == 'Monthly') { //last wednesday of each month
      let calDate = moment().endOf('month').isoWeekday(sinfo.day).format("YYYY-MM-DD");
      this.next_payment = (today >= calDate) ? moment(calDate).add(1, 'months').endOf('month').isoWeekday(sinfo.day).format("YYYY-MM-DD") : calDate;
      this.displayNextPayment = moment(this.next_payment).format("MMM DD, YYYY");
    }
    if (iSchedule.schedule_type == 'Weekly') { //every Wednesday
      let calDate = moment().day(sinfo.day).format("YYYY-MM-DD");
      this.next_payment = (today >= calDate) ? moment(calDate).add(7, 'days') : calDate;
      this.displayNextPayment = moment(this.next_payment).format("MMM DD, YYYY");
    }
    if (iSchedule.schedule_type == 'Twice per month') { //1st 3rd Wednesday of each month
      let dateString = sinfo.date.split(',');
      let calDate = moment().startOf('month').isoWeekday(sinfo.day).format("YYYY-MM-DD");
      let calDate1 = (dateString[0] == 1) ? calDate : moment(calDate).add(7 * (dateString[0] - 1), 'days').format("YYYY-MM-DD");
      let calDate2 = (dateString[1] == 1) ? calDate : moment(calDate).add(7 * (dateString[1] - 1), 'days').format("YYYY-MM-DD");
      if (today >= calDate1 && today >= calDate2) {
        let nextMonthcalDate2 = moment(calDate1).add(1, 'months').format("YYYY-MM-DD");
        let nextMonthcalDate = moment(nextMonthcalDate2).startOf('month').isoWeekday(sinfo.day).format("YYYY-MM-DD");
        if (moment(nextMonthcalDate).format("MM") == moment().format("MM")) {
          nextMonthcalDate = moment(nextMonthcalDate).add(7, 'days').format("YYYY-MM-DD");
        }
        this.next_payment = (dateString[0] == 1) ? nextMonthcalDate : moment(nextMonthcalDate).add(7 * (dateString[0] - 1), 'days').format("YYYY-MM-DD");
      } else if (today >= calDate1) {
        this.next_payment = calDate2;
      } else {
        this.next_payment = calDate1;
      }
      this.displayNextPayment = moment(this.next_payment).format("MMM DD, YYYY");
    }
  }
  paymentScheduleFormSubmit(formData: any) {
    this.errorMsg = '';
    this.errorMsgArr = [];
    if (this.paymentScheduleForm.valid) {
      let iParams = {
        "user": this.loggedUserId,
        "schedule_type": formData.schedule_type,
        "require_balance_amount": formData.require_balance_amount,
        "next_payment_date": moment(this.next_payment).format("YYYY-MM-DD")
      };
      this.apiService.putRequest(constant.apiurl + constant.user_schedule, iParams).subscribe(
        row => {
          this.showSuccess();
          this.dialogRef.close('success');
        }, err => {
          console.log(err);
          this.errorMsg = 'error';
        });
    } else {
      this.errorMsg = 'error';
    }
  }
  geterrorMsg(field) {
    return this.paymentScheduleForm.controls[field].hasError('required') ? 'You must enter a value' : '';
  }
  showSuccess() {
    this.is_success = true;
    setTimeout(() => {
      this.is_success = false;
    }, 2000);
  }

  onCancel() {
    this.dialogRef.close('cancel');
  }

}
