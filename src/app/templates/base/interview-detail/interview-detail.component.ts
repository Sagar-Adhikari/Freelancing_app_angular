import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api/api.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import {
  MatSnackBar
} from '@angular/material';
import { constant, inputData } from '../../../../data/constant';
import * as moment from 'moment';
import { UserService } from '../../../services/sync/user.service';

@Component({
  selector: 'app-interview-detail',
  templateUrl: './interview-detail.component.html',
  styleUrls: ['./interview-detail.component.css'],
  providers: [NgbRatingConfig] // add NgbRatingConfig to the component providers
})

export class InterviewDetailComponent implements OnInit {
  interview_id: any;
  payment:any;
  isLoad: boolean = false;
  iData: any;
  clientMessge: any;
  job_id: any;
  inviteResult = [];
  responseDate: any;
  jobTitleName; jobDescrption; jobCreatedAt;
  categoryId: any;
  jobCommitment: any; expComp;
  expSkills: any = [];
  hiredLevel: any;
  statusData = '';
  skillists: any;
  skillsDisplays: any = [];
  commits = inputData.commits;
  complements = inputData.compliments;
  hiredLevelTxt = inputData.hiredLevelFullTxt;

  proposal_count: any;
  proposalFormat = inputData.proposalFormat;
  interviewingCount = 0;
  unansweredCount = 0;
  jobuser: any; clientInfo: any = 0;
  showClient: boolean = false;
  invite_sent: any;
  declineResult:any;
   constructor(
     private userservice: UserService,
     private apiService: ApiService,
     private router: Router,
     private route: ActivatedRoute,
     private ratingConfig: NgbRatingConfig,
     public snackBar: MatSnackBar
  ) {
    this.interview_id = this.route.snapshot.paramMap.get('id');
    // customize default values of ratings used by this component tree
    ratingConfig.max = inputData.maximumRatingConfig;
    ratingConfig.readonly = true;
  }

  ngOnInit() {
    this.getInterviewdetails();
  }
  /** Get Interview details */
  getInterviewdetails() {
    var href = constant.apiurl + constant.invite_job_details + this.interview_id;
    this.apiService.getRequest(href).subscribe(
      data => {
        this.isLoad = true;
        this.iData = data;
        this.clientMessge = this.iData.body.reason;
        this.job_id = this.iData.body.job_detail.id;
        this.jobTitleName = this.iData.body.job_detail.name;
        this.jobCreatedAt = this.iData.body.posted_date;
        this.categoryId = this.iData.body.job_detail.category_id;
        this.hiredLevel = this.iData.body.job_detail.job_levels;
        this.jobDescrption = this.iData.body.job_detail.description;
        this.jobCommitment = this.iData.body.job_detail.commitment;
        this.expComp = this.iData.body.job_detail.expected_to_complete;
        this.statusData = this.iData.body.status;
        this.getSkills();
        this.getJobDetails();
        this.inviteResult.push(this.iData.body);
      });
  }
  /** Get Skill details */
  getSkills() {
    this.apiService.getRequest(constant.apiurl + constant.getallskill + '?category=' + this.categoryId)
      .subscribe(responseData => {
        this.skillists = responseData['body'];
        if (this.expSkills != []) {
          this.expSkills.forEach(element => {
            this.skillists.find(row => {
              if (row.name === element) {
                this.skillsDisplays.push(row.name);
              }
            });
          });
        }
      });
  }
  /** Navigation to skill search */
  skillBasedSearch(skill) {
    this.router.navigate(['/search/job'], { queryParams: { skill: skill }, queryParamsHandling: 'merge' });
  }
  /** Get Job details */
  getJobDetails() {
    const url = constant.apiurl + constant.getindivualjobdetails + '/' + this.job_id + '/';
    this.apiService.getRequest(url).subscribe(
      row => {
        if (row['status'] === 200 && row['ok'] === true) {
          console.log(row);
          this.responseDate = row;
          this.payment = this.responseDate.body.payment;
          this.jobCreatedAt = this.responseDate.body.created;
          this.proposal_count = this.responseDate.body.proposal_count;
          this.interviewingCount = this.responseDate.body.interview_count;
          this.unansweredCount = this.responseDate.body.unanswer_user;
          this.invite_sent = this.responseDate.body.invite_sent;
          this.jobuser = this.responseDate.body.user;
          this.getClientInfo();
        }
      });
  }
  /** Get client Information */
  getClientInfo() {
    this.apiService.getRequest(constant.apiurl + constant.get_user_details + this.jobuser + '/').subscribe(
      data => {
        if (data['status'] === 200 && data['ok'] === true) {
          this.clientInfo = data['body'];
          this.showClient = true;
          this.clientInfo.profile.membersince = moment(this.clientInfo.profile.created).format("MMM D, YYYY");
        }
      }, err => {
        console.log(err);
      });
  }
  /** Decline Invite */
  declineInvite() {
    let params = { 'id': this.interview_id, 'status': 'cancel' };
    this.apiService.putRequest(constant.apiurl + constant.declineInvite, params).subscribe(
      data => {
        this.declineResult = data;
        if(this.declineResult.error != "" && typeof this.declineResult.error != 'undefined') {
          this.userservice.snackErrorMessage(this.declineResult.error);
        }else{
          this.userservice.snackMessage('Declined Successfully');
        }
        this.router.navigate(['/myproposal']);
      }, err => {
        console.log(err);
      });
  }

}
