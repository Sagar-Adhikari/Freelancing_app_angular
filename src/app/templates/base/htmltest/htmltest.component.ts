import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ApiService } from '../../../services/api/api.service';
import { constant } from '../../../../data/constant';

@Component({
  selector: 'app-htmltest',
  templateUrl: './htmltest.component.html',
  styleUrls: ['./htmltest.component.css']
})
export class HtmltestComponent implements OnInit {
  userID = this.apiService.decodejwts().userid; // logged user id
  group_id: any;
  resGroupDetails: any;
  testGroupDetails: any;
  resTestEligible: any;
  resTestEligibleDetails: any;
  errResEligible: any;
  errMsgEligible = '';

  constructor(
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.group_id = params['groupid'];
    });
    this.getTestGroupDetails();
  }

  getTestGroupDetails() {
    this.apiService.getRequest(constant.apiurl + constant.getTestGroupDetails + this.group_id).subscribe(
      data => {
      this.resGroupDetails = data;
      if (this.resGroupDetails.status === 200 && this.resGroupDetails.ok === true) {
        this.testGroupDetails = this.resGroupDetails.body;
        //need to add time
      }
    }, err => {
      this.router.navigate(['/search/test']);
    });
  }

  checkEliableTest(id) {
    const params = {
      'user': this.userID,
      'groups': id
    };
    this.apiService.postRequest(constant.apiurl + constant.testPaperRegCheck, params).subscribe(
      data => {
      this.resTestEligible = data;
      if (this.resTestEligible.status === 'Active' && this.resTestEligible.id !== '') {
        this.resTestEligibleDetails = this.resTestEligible.body;
        this.router.navigate(['/testquestions/', id]);
      }
    }, err => {
      this.errResEligible = err;
      if (this.errResEligible.error.non_field_errors.length !== 0) {
        this.errMsgEligible = this.errResEligible.error.non_field_errors[0];
      }
    });
  }

}
