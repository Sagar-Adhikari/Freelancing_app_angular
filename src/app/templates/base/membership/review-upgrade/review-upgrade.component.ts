import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { constant } from '../../../../../data/constant';
import { ApiService } from '../../../../services/api/api.service';
import { UserService } from '../../../../services/sync/user.service';
// import { BillingMethodComponent } from './../../billing-method/billing-method.component';
import { FormBuilder, FormGroup ,Validators, FormControl, DefaultValueAccessor, FormArray } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-review-upgrade',
  templateUrl: './review-upgrade.component.html',
  styleUrls: ['./review-upgrade.component.css']
})
export class ReviewUpgradeComponent implements OnInit {
  upgradeMembership: any;
  membership_id: any;
  loggedUserID: any;
  initialData: any;
  currentPlan: any;
  isLoadCurrent: boolean = false;
  newPlan: any;
  isLoadNew: boolean = false;
  currentBilling: any;
  isBilling: boolean = false;
  is_primaryPayAvail:boolean;
  // PopupDialogRef: MatDialogRef<BillingMethodComponent>;

  constructor(
    private apiService: ApiService,
    private usersService: UserService,
    private router: Router, private route: ActivatedRoute,
    private fb: FormBuilder, private dialog: MatDialog
  ) {
    this.upgradeMembership = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.loggedUserID = this.apiService.decodejwts().userid;
    this.getUserProfile();
    this.getNewPlan();
    this.getCurrentBilling();
  }
  /** Get Logged user details */
  getUserProfile() {
    this.apiService.getRequest(constant.apiurl + constant.updateUserDetails + this.loggedUserID + '/').subscribe(
      data => {
        if (data['status'] === 200 && data['ok'] === true) {
          this.initialData = data['body'];
          this.membership_id = this.initialData.profile.membership;
          this.is_primaryPayAvail = this.initialData.profile.payment_verify;
          this.getCurrentPlan();
        }
      }, err => {
        console.log(err);
      });
  }

  /** Get Current Plan */
  saveSubscription() {
      let datas = {
        'user': this.apiService.decodejwts().userid,
        'email': this.apiService.decodejwts().email,
        'source': null,
        'membership': this.upgradeMembership
      };
    
    this.apiService.postRequest(constant.apiurl + constant.save_subscription, datas).subscribe(
      data => {
        this.usersService.snackMessage('Membership has been upgraded successfully.');
        this.router.navigate(['setting/membership']);
      }, error => console.log('error'));
  }

  getCurrentPlan() {
    if (this.membership_id != "" && this.membership_id != null) {
      this.apiService.getRequest(constant.apiurl + constant.membership + this.membership_id + '/').subscribe(
        data => {
          if (data['status'] === 200 && data['ok'] === true) {
            this.currentPlan = data['body'];
            this.isLoadCurrent = true;
          }
        }, err => {
          console.log(err);
        });
    }
  }
  /** Get New Plan */
  getNewPlan() {
    if (this.upgradeMembership != "" && this.upgradeMembership != null) {
      this.apiService.getRequest(constant.apiurl + constant.membership + this.upgradeMembership + '/').subscribe(
        data => {
          if (data['status'] === 200 && data['ok'] === true) {
            this.newPlan = data['body'];
            this.isLoadNew = true;
          }
        }, err => {
          console.log(err);
        });
    }
  }
  /** Get Billing info */
  getCurrentBilling() {
    if (this.upgradeMembership != "" && this.upgradeMembership != null) {
      this.apiService.getRequest(constant.apiurl + constant.currentBillingInfo + '?membership=' + this.upgradeMembership).subscribe(
        data => {
          if (data['status'] === 200 && data['ok'] === true) {
            this.currentBilling = data['body'];
            this.isBilling = true;
          }
        }, err => {
          console.log(err);
        });
    }
  }

  billingPopup(){
    // console.log(this.currentPlan.membership_name);
    // console.log(this.is_primaryPayAvail)
    // if(this.is_primaryPayAvail){
    //   console.log('Payment already method available')
    //   this.saveSubscription();
    //   this.getUserProfile();
    // }else{
    //   console.log('Payment method not available add new payment method')
    //   this.PopupDialogRef = this.dialog.open(BillingMethodComponent, {
    //     disableClose: true,
    //     data: {'membership_info': this.newPlan, 'user_info': this.initialData, 'type':2}
    //   });
  
    //   this.PopupDialogRef.afterClosed().subscribe(result => {
    //     if(result != 'cancel'){
    //       this.usersService.snackMessage('Membership has been upgraded successfully.');
    //       this.getUserProfile();
    //       this.router.navigate(['setting/membership']);
    //     }
    //   });
    // }
    
  }
}
