import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { constant } from '../../../../../data/constant';
import { ApiService } from '../../../../services/api/api.service';
import { UserService } from '../../../../services/sync/user.service';

@Component({
  selector: 'app-change-plan',
  templateUrl: './change-plan.component.html',
  styleUrls: ['./change-plan.component.css']
})
export class ChangePlanComponent implements OnInit {
  loggedUserID: any;
  initialData: any;
  membership_id: any;
  membershipData: any;
  isLoadMembership: boolean = false;
  currentMembership:any = [];
  responceSwitch:any;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private userService: UserService
  ) {
   }
  ngOnInit() {
    this.loggedUserID = this.apiService.decodejwts().userid;
    this.getUserProfile();
    this.getAllMembership();
  }
  getUserProfile() {
    this.apiService.getRequest(constant.apiurl + constant.updateUserDetails + this.loggedUserID + '/').subscribe(
      data => {
        if (data['status'] === 200 && data['ok'] === true) {
          this.initialData = data['body'];
          this.membership_id = this.initialData.profile.membership;

        }
      }, err => {
        console.log(err);
      });
  }
  getAllMembership() {
    this.apiService.getRequest(constant.apiurl + constant.membership).subscribe(
      data => {
        if (data['status'] === 200 && data['ok'] === true) {
          this.membershipData = data['body'];
          this.isLoadMembership = true;
        }
      }, err => {
        console.log(err);
      });
  }
   /** Switch membership */
   switchMembership(switchId){
      const params = {
        'membership_id': switchId
      };
      this.apiService.putRequest(constant.apiurl + constant.updateMembership, params ).subscribe(
        data => {
          this.responceSwitch = data;
          if (this.responceSwitch.membership_id != '') {
            this.userService.snackMessage('Membership switched!!!');
            this.router.navigate(['/setting/membership/']);
          }
        }, err => {
          console.log(err);
        });
    }
}
