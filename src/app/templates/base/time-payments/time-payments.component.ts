// import { Component, OnInit, ViewChild } from '@angular/core';
// import { Router, ActivatedRoute } from '@angular/router';
// import { MatDialog } from '@angular/material';

// import * as moment from 'moment';

// import { constant } from '../../../../data/constant';
// import { ApiService } from '../../../services/api/api.service';
// import { UserService } from '../../../services/sync/user.service';
// import { AddManualTimeComponent } from '../add-manual-time/add-manual-time.component';
// import { ViewPaymentMemoComponent } from './view-payment-memo/view-payment-memo.component';

// import { StripeService, Elements, Element as StripeElement, ElementsOptions } from 'ngx-stripe';
// import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { DomSanitizer} from '@angular/platform-browser';

// @Component({
//   selector: 'app-time-payments',
//   templateUrl: './time-payments.component.html',
//   styleUrls: ['./time-payments.component.css']
// })
// export class TimePaymentsComponent implements OnInit {
//   offer_id: any;
//   resultData: any;
//   offerData: any;
//   display: boolean = false;
//   is_owner: boolean = false;
//   expires: any;
//   freelancer_id: any;
//   loggedId: any = ''
//   manual_time = true;
//   userType: any = ''
//   responseData: any;
//   //user avatar
//   user_avatar_url = constant.apiurl + constant.user_avatar;
//   displayedColumns: string[] = ['no', 'from_time', 'to_time', 'sum_hours', 'action'];
//   displayColumnsHrlyDetails: string[] = ['weeks'];
//   dataSource: any[] = [];
//   resReportData: any;
//   resHourlyDetailsData: any;
//   clientHourlyDatas: any;
//   totalHourlyTime: any;
//   totalHourPaid: any;
//   paymentWeeks: any;
//   amountToPaid: any;
//   payment_btn: boolean = true;
//   cardDetails: any;
//   resCmsData: any;
//   desc: any;
//   constructor(
//     private apiService: ApiService,
//     private usersService: UserService,
//     private router: Router,
//     private route: ActivatedRoute,
//     private dialog: MatDialog,
//     private fb: FormBuilder,
//     private stripeService: StripeService,
//     private sanitizer: DomSanitizer
//   ) {
//     this.offer_id = this.route.snapshot.paramMap.get('mid');
//     this.loggedId = this.apiService.decodejwts().userid;
//     this.userType = this.apiService.decodejwts().user_type;
//     this.offerDetails();
//     this.getPaymentTimeList();
//     this.clientHourlyDetails();
//   }

//   ngOnInit() {
//     let url = constant.apiurl + constant.getcmspage + '?slug=agreement';
//     this.apiService.getRequest(url).subscribe(data => {
//       this.resCmsData = data;
//       if (this.resCmsData.status === 200 && this.resCmsData.body.length !== 0) {
//         this.desc = this.resCmsData.body[0].description;
//       }
//     });
//   }

//   clientHourlyDetails() {
//     this.apiService.getRequest(constant.apiurl + constant.get_hourlyd_etail_client + '?contract_id=' + this.offer_id).subscribe(
//       resdata => {
//         this.resHourlyDetailsData = resdata;
//         if (this.resHourlyDetailsData.body.weeks && this.resHourlyDetailsData.body.weeks.length > 0) {
//           this.clientHourlyDatas = this.resHourlyDetailsData.body.weeks;
//           this.totalHourlyTime = this.resHourlyDetailsData.body.total_hr;
//           this.totalHourPaid = this.resHourlyDetailsData.body.paid_hr;
//           this.paymentWeeks = this.resHourlyDetailsData.body.weeks_s;
//           this.amountToPaid = this.resHourlyDetailsData.body.amount_to_paid;
//         }
//       });
//   }
//   offerDetails() {
//     this.apiService.getRequest(constant.apiurl + constant.savecontracts + this.offer_id + '/').subscribe(
//       data => {
//         this.display = true;
//         this.resultData = data;
//         this.offerData = this.resultData.body;
// console.log(this.offerData)
//         this.manual_time = this.offerData.manual_time;
//         if (typeof this.offerData.detail != 'undefined') {
//           if (this.userType == 'client') {
//             this.router.navigate(['joblisting']);
//           } else {
//             this.router.navigate(['freelancerprofile']);
//           }
//         } else {
//           var format = moment(this.offerData.created).format("YYYY-MM-DD");
//           this.expires = moment(format, "YYYY/MM/DD").add('days', 7);
//           this.freelancer_id = this.offerData.freelancer.id;
//           if (this.loggedId == this.offerData.client.id) {
//             this.is_owner = true;
//           }
//         }
//       }, err => {
//         console.log('Something went wrong.');
//       });
//   }
//   manualtimePopup(id: any,startdate) {
//     const dialogChoosebilling = this.dialog.open(AddManualTimeComponent, {
//       disableClose: true,
//       data: { 'contract_id': id ,'start_date':startdate }
//     });
//     dialogChoosebilling.afterClosed().subscribe(result => {
//       if (result !== 'cancel') {
//         this.getPaymentTimeList();
//       }
//     });
//   }

//   getPaymentTimeList() {
//     this.apiService.getRequest(constant.apiurl + constant.contract_payment_time_report + '?contract=' + this.offer_id).subscribe(
//       data => {
//         this.display = true;
//         this.resReportData = data;
//         if (this.resReportData.body.Time_list) {
//           this.dataSource = this.resReportData.body.Time_list;
//         } else {
//           this.dataSource = [];
//         }
//         this.clientHourlyDetails();
//       }, err => {
//         console.log('Something went wrong.');
//       });
//   }

//   viewPaymentReport(index) {
//     const popupPaymentMemo = this.dialog.open(ViewPaymentMemoComponent, {
//       data: { 'payview': this.dataSource[index] }
//     });
//   }

//   manualTimePayment(offerID) {
//     this.payment_btn = false;
//     var params = {
//       'amount': this.amountToPaid,
//       'contract_id': offerID,
//       'weeks': this.paymentWeeks
//     };
//     if(params.amount < 1){
//       this.usersService.snackMessage('Dont have enough balance');
//       this.payment_btn = true;
//       return false;
//     }
//     this.apiService.postRequest(constant.apiurl + constant.pay_hourly_payment_client, params).subscribe(
//       data => {
//         this.usersService.snackMessage('Amount successfully paid');
//         this.payment_btn = true;
//         this.clientHourlyDetails();
//       }, err => {
//           this.usersService.snackMessage("Error on payment");
//       });
//   }
// }