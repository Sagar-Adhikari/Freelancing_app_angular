// /*
//  * Page : Billing Method 
//  * Use: This page only used to submit the strip and paypal information
//  * Functionality :
//  *  >> Create the angular material form
//  *  >> Saved the stripe and paypal transaction to backend
//  * Created Date : 05/01/2019
//  * Updated Date : 07/01/2019
//  * Copyright : Bsetec
//  */
// import { Component, OnInit, Inject } from '@angular/core';
// import { ApiService } from '../../../services/api/api.service';
// import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
// import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatAutocomplete } from '@angular/material';
// import { constant } from '../../../../data/constant';
// import { FormBuilder, FormGroup, Validators, FormControl, DefaultValueAccessor, FormArray } from '@angular/forms';
// import { of } from 'rxjs';
// import { PayPalConfig, PayPalEnvironment, PayPalIntegrationType } from 'ngx-paypal';
// import { UserService } from '../../../services/sync/user.service';
// import { Location } from '@angular/common';

// @Component({
//   selector: 'app-billing-method',
//   templateUrl: './billing-method.component.html',
//   styleUrls: ['./billing-method.component.css']
// })
// export class BillingMethodComponent implements OnInit {
//   //variable definition
//   credit: boolean = true;
//   paypal: boolean = false;
//   errorMsg: boolean = false;
//   billingForm: FormGroup;
//   credit_card_mask = [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/];
//   month_mask = [/\d/, /\d/];
//   year_mask = [/\d/, /\d/];
//   cvv_mask = [/\d/, /\d/, /\d/];
//   errormessage: any;
//   isbuttondisable: boolean = false;
//   stripe_errorMsg: boolean = false;
//   result: any;
//   resStripError: any;
//   //strip form
//   stripeTest: FormGroup;

//   first_name: string = this.apiService.decodejwts().first_name;
//   last_name: string = this.apiService.decodejwts().last_name;
//   payPalConfig?: PayPalConfig;

//   membership_info: any;
//   user_info: any;
//   page_type: number;
//   billing_count: any;
//   contract_id: any;
//   resultData: any;
//   offerData: any;
//   baseUrl: any = constant.siteBaseUrl;
//   hideclose = false;
//   constructor(@Inject(MAT_DIALOG_DATA) public getdata: any, public location: Location, private apiService: ApiService, private router: Router, private route: ActivatedRoute, private fb: FormBuilder, private dialogRefbilling: MatDialogRef<BillingMethodComponent>, private stripeService: StripeService, private syncVar: UserService) {

//     this.billingForm = fb.group({
//       'card_number': [null, Validators.compose([Validators.required])],
//       'first_name': [this.first_name, Validators.compose([Validators.required, this.noWhitespaceValidator])],
//       'last_name': [this.last_name, Validators.compose([Validators.required, this.noWhitespaceValidator])],
//       'expire_month': [null, Validators.compose([Validators.required])],
//       'expire_year': [null, Validators.compose([Validators.required])],
//       'cvv': [null, Validators.compose([Validators.required])],
//     });
//     this.page_type = this.getdata.type;
//     if (this.page_type == 2) {
//       this.membership_info = this.getdata.membership_info;
//       this.user_info = this.getdata.user_info;
//     } else if (this.page_type == 3) {
//       this.contract_id = this.getdata.contract_id;
//     }
//     this.syncVar.billingcounts.subscribe(counts => {
//       this.billing_count = counts;
//     });
//   }
//   ngOnInit() {
//     if (this.page_type == 1) {
//       this.initContractconfig();
//     } else if (this.page_type == 2) {
//       this.initConfig();
//     } else if (this.page_type == 3) {
//       this.getContractinfo();
//     }
//     this.hideclose = this.getdata.hideclose;
//   }

//   /** This function is used to validate the whitespace in the from */
//   noWhitespaceValidator(control: FormControl) {
//     let isWhitespace = (control.value || '').trim().length === 0;
//     let isValid = !isWhitespace;
//     return isValid ? null : { 'whitespace': true }
//   }

//   /** This function is used to change the billing type like stripe or paypal */
//   changeBillingType(event) {
//     if (event.value == 1) {
//       this.credit = true;
//       this.paypal = false;
//     } else {
//       this.credit = false;
//       this.paypal = true;
//     }
//   }

//   /** This function is used to get the stripe token and send to backend */
//   saveBilling(post) {
//     this.errorMsg = false;
//     this.stripe_errorMsg = false;
//     if (this.billingForm.valid) {
//       this.isbuttondisable = true;
//       var card = {
//         number: post.card_number,
//         exp_month: post.expire_month,
//         exp_year: post.expire_year,
//         cvc: post.cvv
//       };
//       (<any>window).Stripe.card.createToken(card, (status: number, response: any) => {
//         this.resStripError = response;
//         if (status === 200) {
//           if (this.page_type == 1) {
//             var datas = {
//               'user': this.apiService.decodejwts().userid,
//               'email': this.apiService.decodejwts().email,
//               'source': response.id
//             };
//             if (this.billing_count == 0) {
//               datas['primary'] = true;
//             }
//             this.saveBillinginfo(datas);
//           } else if (this.page_type == 2) {
//             var sub_datas = {
//               'user': this.apiService.decodejwts().userid,
//               'email': this.apiService.decodejwts().email,
//               'source': response.id,
//               'membership': this.membership_info.id
//             };
//             this.saveSubscription(sub_datas);
//           } else if (this.page_type == 3) {
//             var contract_datas = {
//               // 'user':  this.apiService.decodejwts().userid,
//               // 'email': this.apiService.decodejwts().email,
//               'source': response.id,
//               'contract_id': this.contract_id,
//               'amount': this.getdata.amount
//             };
//             this.saveEscrow(contract_datas);
//           }
//         } else {
//           var strmsgs = this.resStripError.error.message;
//           strmsgs = strmsgs.replace("exp_month", "Expires Month");
//           strmsgs = strmsgs.replace("exp_year", "Expires Year");
//           this.errormessage = strmsgs;
//           this.stripe_errorMsg = true;
//           this.isbuttondisable = false;
//           const element: HTMLElement = document.querySelector('#cvvfocus') as HTMLElement;
//           element.focus();
//         }
//       });
//     } else {
//       this.errorMsg = true;
//       this.isbuttondisable = false;
//     }
//   }

//   /** This function is used to make the stripe payment subscription */
//   saveSubscription(datas: any) {
//     this.apiService.postRequest(constant.apiurl + constant.save_subscription, datas).subscribe(
//       data => {
//         this.result = data;
//         this.closePopup();
//       }, error => {
//         this.isbuttondisable = false;
//         this.stripe_errorMsg = true;
//         this.errormessage = error.error[0];
//       });
//   }

//   closePopup() {
//     let element: HTMLElement = document.querySelector('input[class="form-control"]') as HTMLElement;
//     element.click();
//     let element2: HTMLElement = document.querySelector('#closeButton') as HTMLElement;
//     element2.click();
//   }
//   onSuccessClose() {
//     this.dialogRefbilling.close('success');
//   }
//   /** This function is used to save the stripe token to backend */
//   saveBillinginfo(datas: any) {
//     this.apiService.postRequest(constant.apiurl + constant.save_stripe, datas).subscribe(
//       data => {
//         this.result = data;
//         this.isbuttondisable = true;
//         this.closePopup();
//       }, error => {
//         this.isbuttondisable = false;
//         this.stripe_errorMsg = true;
//         this.errormessage = error.error[0];
//         console.log(error);
//       });
//   }

//   /** This function is used to make the stripe payment to escrow deposit */
//   saveEscrow(datas: any) {

//     this.apiService.putRequest(constant.apiurl + constant.save_escrow, datas).subscribe(
//       data => {
//         this.result = data;
//         if (this.result.status) {
//           this.isbuttondisable = true;
//           setTimeout(() => {
//             // this.ismessage = false;
//             this.isbuttondisable = false;
//           }, 2000);
//           this.closePopup();
//         } else {
//           this.isbuttondisable = false;
//           this.dialogRefbilling.close('close');
//           this.syncVar.snackMessage('Deposit has been completed successfully.');
//         }
//       });
//   }


//   /** This function is used to display the error message */
//   geterrorMsg(field) {
//     return this.billingForm.controls[field].hasError('required') ? 'Field is required' : '';
//   }

//   /** This function is used to close the billing popup */
//   onCancel() {
//     this.dialogRefbilling.close('cancel');
//   }

//   /** This function is used to initalize the paypal configuration */
//   initConfig(): void {
//     this.payPalConfig = new PayPalConfig(
//       PayPalIntegrationType.ClientSideREST,
//       PayPalEnvironment.Sandbox,
//       {
//         commit: true,
//         client: {
//           sandbox:
//             constant.paypalpublickey
//         },
//         button: {
//           label: 'paypal',
//           layout: 'vertical'
//         },
//         onAuthorize: (data, actions) => {
//           console.log('Authorize');
//           return of(undefined);
//         },
//         onPaymentComplete: (data, actions) => {
//           console.log('OnPaymentComplete');
//           console.log(data);
//           var options = {
//             "amount": this.membership_info.membership_amount,
//             "type": 'Paypal',
//             "transaction_id": data.orderID,
//             "response": JSON.stringify(data),
//             "user": this.user_info.id,
//             "membership": this.membership_info.id
//           };

//           this.apiService.postRequest(constant.apiurl + constant.save_transaction, options).subscribe(
//             data => {
//               this.result = data;
//               if (this.result.status) {
//                 console.log('something went wrong.');
//               } else {
//                 if (this.page_type == 2) {
//                   this.dialogRefbilling.close('close');
//                 } else {
//                   this.syncVar.snackMessage('Payment has been completed successfully.');
//                   this.dialogRefbilling.close('close');
//                 }
//               }
//             });


//         },
//         onCancel: (data, actions) => {
//           console.log('OnCancel');
//         },
//         onError: err => {
//           console.log('OnError');
//         },
//         onClick: () => {
//           console.log('onClick');
//         },
//         validate: (actions) => {
//           console.log(actions);
//         },
//         experience: {
//           noShipping: true,
//           brandName: 'Remote Nepal'
//         },
//         transactions: [
//           {
//             amount: {
//               total: this.membership_info.membership_amount,
//               currency: 'USD',
//               details: {
//                 subtotal: this.membership_info.membership_amount,
//                 tax: 0.00,
//                 shipping: 0.00,
//                 handling_fee: 0.00,
//                 shipping_discount: -0.00,
//                 insurance: 0.00
//               }
//             },
//             custom: 'Custom value',
//             item_list: {
//               items: [
//                 {
//                   name: 'Freelancer' + this.membership_info.membership_name,
//                   description: 'Membership plan allow to ' + this.membership_info.membership_connect + ' connects',
//                   quantity: 1,
//                   price: this.membership_info.membership_amount,
//                   tax: 0.00,
//                   sku: '1',
//                   currency: 'USD'
//                 }],
//               shipping_address: {
//                 recipient_name: this.first_name + ' ' + this.last_name,
//                 line1: this.user_info.profile.address,
//                 line2: '',
//                 city: this.user_info.profile.city,
//                 country_code: this.user_info.profile.country,
//                 postal_code: this.user_info.profile.zipcode,
//                 phone: this.user_info.profile.phone,
//                 state: this.user_info.profile.state
//               },
//             },
//           }
//         ],
//         note_to_payer: 'Contact us if you have troubles processing payment'
//       }
//     );
//   }

//   getContractinfo() {
//     this.apiService.getRequest(constant.apiurl + constant.savecontracts + this.contract_id + '/').subscribe(
//       data => {
//         this.resultData = data;
//         this.offerData = this.resultData.body;
//         this.initContractconfig();
//       }, err => {
//         console.log('Something went wrong.');
//       });
//   }

//   goBack() {
//     this.dialogRefbilling.close('goback');
//   }

//   /** This function is used to initalize the paypal configuration */
//   initContractconfig(): void {
//     this.payPalConfig = new PayPalConfig(
//       PayPalIntegrationType.ClientSideREST,
//       PayPalEnvironment.Sandbox,
//       {
//         commit: true,
//         client: {
//           sandbox:
//             constant.paypalpublickey
//         },
//         button: {
//           label: 'paypal',
//           layout: 'vertical'
//         },
//         onAuthorize: (data, actions) => {
//           console.log('Authorize');
//           return of(undefined);
//         },
//         onPaymentComplete: (data, actions) => {
//           console.log('OnPaymentComplete');
//           console.log(data);
//           var options = {
//             "amount": this.offerData.amount,
//             "type": 'Paypal',
//             "transaction_id": data.orderID,
//             "response": JSON.stringify(data),
//             "user": this.offerData.client.id,
//             "contract": this.contract_id
//           };

//           this.apiService.postRequest(constant.apiurl + constant.save_transaction, options).subscribe(
//             data => {
//               this.result = data;
//               if (this.result.status) {
//                 console.log('something went wrong.');
//               } else {
//                 this.syncVar.snackMessage('Payment has been completed successfully.');
//               }
//             });


//         },
//         onCancel: (data, actions) => {
//           console.log('OnCancel');
//         },
//         onError: err => {
//           console.log('OnError');
//         },
//         onClick: () => {
//           console.log('onClick');
//         },
//         validate: (actions) => {
//           console.log(actions);
//         },
//         experience: {
//           noShipping: true,
//           brandName: 'Remote Nepal'
//         },
//         transactions: [
//           {
//             amount: {
//               total: this.offerData.amount,
//               currency: 'USD',
//               details: {
//                 subtotal: this.offerData.amount,
//                 tax: 0.00,
//                 shipping: 0.00,
//                 handling_fee: 0.00,
//                 shipping_discount: -0.00,
//                 insurance: 0.00
//               }
//             },
//             custom: 'Custom value',
//             item_list: {
//               items: [
//                 {
//                   name: this.offerData.title,
//                   description: 'Deposit escrow amount $' + this.offerData.amount,
//                   quantity: 1,
//                   price: this.offerData.amount,
//                   tax: 0.00,
//                   sku: '1',
//                   currency: 'USD'
//                 }],
//               shipping_address: {
//                 recipient_name: this.offerData.client.first_name + ' ' + this.offerData.client.last_name,
//                 line1: this.offerData.client.address,
//                 line2: '',
//                 city: this.offerData.client.city,
//                 country_code: this.offerData.client.country,
//                 postal_code: this.offerData.client.zipcode,
//                 phone: this.offerData.client.phone,
//                 state: this.offerData.client.state
//               },
//             },
//           }
//         ],
//         note_to_payer: 'Contact us if you have troubles processing payment'
//       }
//     );
//   }
//   esewaPay(){
//     this.dialogRefbilling.close('goback');
//     this.router.navigate(['setting/billing-methods/esewa']);
//   }
//   khaltiPay(){
//     this.dialogRefbilling.close('goback');
//     this.router.navigate(['setting/billing-methods/khalti']);
//   }
 
// }
