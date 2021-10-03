import { user } from './../../../../model/user';
import { UserService } from './../../../services/sync/user.service';
import { Component, OnInit, Inject } from '@angular/core';
import {
  MatSnackBar,
  MatDialog
} from '@angular/material';
import { ApiService } from '../../../services/api/api.service';
import { constant, inputData } from '../../../../data/constant';
import { Title, DOCUMENT } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewpreviewComponent } from '../../../templates/base/jobdetail/viewpreview/viewpreview.component';

import { country } from '../../../../data/country';

@Component({
  selector: 'app-view-job',
  templateUrl: './view-job.component.html',
  styleUrls: ['./view-job.component.css']
})
export class ViewJobComponent implements OnInit {

  job_id; responseDate: any = [];
  jobTitleName; jobDescrption; jobCreatedAt;
  jobCommitment: any; expComp;
  jobPayment: any;
  expSkills: any = [];
  skillists: any = []; mainCategory: any = [];
  skillsDisplays: any = [];
  countries: any = country.list;
  selectedCountry: any;
  hiredLevel: any = '';
  baseurl: any = '';
  findPropose = true;
  resfindPropose: any = [];
  user_id: any;
  userName: any;
  userLocation: any;
  userAddress: any;
  validOS: any;
  otherOS: any;
  projectType: any;
  resource: any;
  lifeCycle: any;
  experience: any;
  language: any;
  framework: any;
  amount: any;
  preferenceType: any;
  freelanceScore: any;
  freelanceTalent: any;
  hoursBilledWork: any;
  location: any;
  englishLevel: any;

  commits = [
    { 'key': '>30', 'name': 'More than 30 hrs/week' },
    { 'key': '<30', 'name': 'Less than 30 hrs/week' },
    { 'key': 'none', 'name': 'I don`t know yet' }
  ];
  complements = [
    { 'key': '>6', 'name': 'More than 6 months' },
    { 'key': '3-6', 'name': '3 to 6 months' },
    { 'key': '1-3', 'name': '1 to 3 months' },
    { 'key': '<6', 'name': 'less than 1 month' },
    { 'key': '<1', 'name': 'less than 1 week' }
  ];
  hiredLevelTxt = {
    'Entry': 'I am looking for freelancers with the lowest rates',
    'Intermediate': 'I am looking for a mix of experience and value',
    'Expert': 'I am willing to pay higher rates for the most experienced freelancers'
  };
  proposal_count:any;
  interviewingCount= 0;
  unansweredCount=0;
  proposalFormat = inputData.proposalFormat;
  invite_sent:any=0;
  textLength = 150;
  initialTextLength = 150;
  morelessText = 'More';
  attachmentFile = false;
  uploadedFileArr: any = [];
  attachment: any = [];
  filetype: any;
  image_url = constant.imgurl;

  public selection= false;
  isbuttondisable:boolean = false; 
  disabled = false;

  ismessage:boolean = false;
  is_success:boolean = false;
  errormessage:string = "";

  constructor(
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    @Inject(DOCUMENT) private document: HTMLDocument,
    private titleService: Title,
    private router: Router,
    private route: ActivatedRoute,
    private userService:UserService
  ) { }

  onMoreFun(textlength, findText) {
    if (findText === 'More') {
      this.textLength = textlength;
      this.morelessText = 'Less';
    } else {
      this.textLength = 150;
      this.morelessText = 'More';
    }
    this.morelessText = this.morelessText;
    if (this.jobDescrption.length < this.initialTextLength) {
      this.morelessText = '';
    }
  }

  viewAttachment(file, ext) {
    const dialogEditTitle = this.dialog.open(ViewpreviewComponent, {
      disableClose: true,
      data: {
        'file': file,
        'ext': ext
      }
    });
  }


  ngOnInit() {
  this.baseurl = constant.siteBaseUrl;
    this.activatedRoute.params.subscribe(params => {
      this.job_id = params['id'];
    });
    this.baseurl = constant.siteBaseUrl;
    const url = constant.apiurl + constant.getindivualjobdetails + '/' + this.job_id + '/';
    this.apiService.getRequest(url).subscribe(
      row => {
        if (row['status'] === 200 && row['ok'] === true) {
          console.log('get row:',row);
          this.responseDate = row;
          this.jobTitleName = this.responseDate.body.name;
          this.jobDescrption = this.responseDate.body.description;
          this.jobCommitment = this.responseDate.body.commitment;
          this.jobPayment = this.responseDate.body.payment;
          this.userName = this.responseDate.body.user_name;
          this.userLocation = this.responseDate.body.client_location;
          this.userAddress = this.responseDate.body.client_full_address;
          this.validOS = this.responseDate.body.os;
          this.otherOS = this.responseDate.body.other_os;
          this.projectType = this.responseDate.body.type;
          this.resource = this.responseDate.body.resource;
          this.lifeCycle = this.responseDate.body.life_cycle;
          this.experience = this.responseDate.body.experience;
          this.language = this.responseDate.body.required_language;
          this.framework = this.responseDate.body.required_software;
          this.preferenceType = this.responseDate.body.preference_type;
          this.freelanceScore = this.responseDate.body.freelance_score;
          this.freelanceTalent = this.responseDate.body.freelance_talent;
          this.hoursBilledWork = this.responseDate.body.hours_billed_work;
          this.location = this.responseDate.body.location;
          this.englishLevel = this.responseDate.body.english_level;
          this.expComp = this.responseDate.body.expected_to_complete;
          this.amount = this.responseDate.body.payment_amount;
          this.mainCategory = this.responseDate.body.category_id;
          this.skillsDisplays = this.expSkills = this.responseDate.body.skills !== '' ? this.responseDate.body.skills.split(',') : [];
          this.jobCreatedAt = this.responseDate.body.created;
          this.selectedCountry = this.responseDate.body.location;
          this.hiredLevel = this.responseDate.body.experience_level;
          this.user_id = this.responseDate.body.user;
          this.selection=this.responseDate.body.is_active;
          if (this.jobDescrption.length < this.initialTextLength) {
            this.morelessText = '';
          }
          this.proposal_count = this.responseDate.body.proposal_count;
          this.interviewingCount = this.responseDate.body.interview_count;
          this.unansweredCount = this.responseDate.body.unanswer_user;
          this.invite_sent = this.responseDate.body.invite_sent;
          this.attachmentFile = this.responseDate.body.attachments !== '' ? true : false;
          if (this.responseDate.body.attachments != '') {
            const initialUploadedFile = this.responseDate.body.attachments.split(',');
            this.uploadedFileArr = initialUploadedFile;
            if (this.uploadedFileArr.length > 0) {

              this.uploadedFileArr.forEach(element => {
                this.apiService.getRequest(constant.apiurl + constant.fileupload + element)
                  .subscribe(resData => {
                    // this.initialAttachement.push(responseData['body']);
                    const edifiletype = resData['body']['file_ext'];
                    if (edifiletype === 'image/jpeg' || edifiletype === 'image/jpg' || edifiletype === 'image/png' || edifiletype === 'image/gif') {
                      this.filetype = 'img';
                      // fileItem['tempimage'] = this.DomSan.bypassSecurityTrustResourceUrl(url);
                    } else if (edifiletype === 'video/x-matroska' || edifiletype === 'video/mp4') {
                      this.filetype = 'video';
                    } else if (edifiletype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || edifiletype === 'application/msword') {
                      this.filetype = 'doc';
                    } else if (edifiletype === 'text/csv' || edifiletype === 'application/vnd.ms-excel') {
                      this.filetype = 'csv';
                    } else if (edifiletype === 'application/pdf') {
                      this.filetype = 'pdf';
                    } else if (edifiletype === 'application/x-php') {
                      this.filetype = 'php';
                    } else if (edifiletype === 'application/zip') {
                      this.filetype = 'zip';
                    } else if (edifiletype === 'text/vnd.trolltech.linguist' || edifiletype === 'application/javascript') {
                      this.filetype = 'js';
                    } else if (edifiletype === 'application/sql') {
                      this.filetype = 'sql';
                    } else {
                      this.filetype = 'none';
                    }
                    this.attachment.push({
                      'id': resData['body']['id'],
                      'file_name': resData['body']['file_name'],
                      'filetype': this.filetype,
                      'file_ext': resData['body']['file_ext'],
                      'filepath': this.image_url + resData['body']['file']
                    });
                  });
              });
            }
          }
        }
      });
    // check user already proposed this job
    const check_url = constant.apiurl + constant.job_proposal + '?job=' + this.job_id;
    this.apiService.getRequest(check_url).subscribe(
      row => {
        this.resfindPropose = row;
        if (this.resfindPropose.body.count > 0) {
          this.findPropose = false;
        }
      });
  }

  onUpdate(){
  const check_url = constant.apiurl + constant.jobStatusUpdate  + this.job_id + '/'  ; 
    this.apiService.putRequest(check_url ,this.selection.toString()).subscribe(result => {
    },error => {
      this.errormessage = error.error.non_field_errors["0"];
      this.snackBar.open('Something Went wrong!');
      setTimeout(() => {
        this.snackBar.dismiss();
      }, 2000);

    },() => {
      this.router.navigate(['/admin/jobs']);
      this.snackBar.open('Status Updated Successfully!');
      setTimeout(() => {
        this.snackBar.dismiss();
      }, 2000);
    });
  }

}