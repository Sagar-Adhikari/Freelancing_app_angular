import { Component, OnInit } from '@angular/core';
import { constant } from '../../../../data/constant';
import { ApiService } from '../../../services/api/api.service';
import { UserService } from '../../../services/sync/user.service';
@Component({
  selector: 'app-membership',
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.css']
})
export class MembershipComponent implements OnInit {
  queryUserID: any;
  initialData: any;
  availableConnects: any;
  membership_id: any;
  membershipData: any;
  currentPlan: any;
  isLoadMembership: boolean = false;
  membershipConnects: any;
  membershipFee: any
  membershipType: any;
  currentBilling:any;
  isBilling:boolean = false;
  constructor(
    private userService: UserService,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.userService.sendHeaderLayout('layout2');
    this.queryUserID = this.apiService.decodejwts().userid;
    this.getUserProfile();
  }
  getUserProfile() {
    this.apiService.getRequest(constant.apiurl + constant.updateUserDetails + this.queryUserID + '/').subscribe(
      data => {
        if (data['status'] === 200 && data['ok'] === true) {
          this.initialData = data['body'];
          this.availableConnects = this.initialData.profile.connects;
          this.membership_id = this.initialData.profile.membership;
          this.getMembershipData();
        }
      }, err => {
        console.log(err);
      });
  }
  getMembershipData() {
    if (this.membership_id != "" && this.membership_id != null) {
      this.apiService.getRequest(constant.apiurl + constant.membership + this.membership_id + '/').subscribe(
        data => {
          if (data['status'] === 200 && data['ok'] === true) {
            this.membershipData = data['body'];
            this.currentPlan = this.membershipData.membership_name;
            this.membershipConnects = this.membershipData.membership_connect;
            this.membershipFee = this.membershipData.membership_amount;
            this.membershipType = this.membershipData.membership_type;
            this.isLoadMembership = true;
            this.getCurrentBilling();
          }
        }, err => {
          console.log(err);
        });
    }
  }
  /** Get Billing information */
  getCurrentBilling() {
    this.apiService.getRequest(constant.apiurl + constant.currentBillingInfo + '?membership=' + this.membership_id).subscribe(
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
