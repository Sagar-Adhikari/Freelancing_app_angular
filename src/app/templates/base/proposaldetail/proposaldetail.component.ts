import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ApiService } from '../../../services/api/api.service';
import { UserService } from '../../../services/sync/user.service';
import { constant, inputData } from '../../../../data/constant';
import { country } from '../../../../data/country';
import {
  MatDialog
} from '@angular/material';
import { ViewpreviewComponent } from '../../../templates/base/jobdetail/viewpreview/viewpreview.component';
import { TruncatetextPipe } from '../../../templates/base/jobdetail/truncatetext.pipe';
import {WithdrawProposalComponent} from './withdraw-proposal/withdraw-proposal.component';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-proposaldetail',
  templateUrl: './proposaldetail.component.html',
  styleUrls: ['./proposaldetail.component.css'],
  providers: [NgbRatingConfig] // add NgbRatingConfig to the component providers
})
export class ProposaldetailComponent implements OnInit {
  proposalId: any;
  resProposalData: any;
  proposalDetails: any;
  countries: any = country.list;
  skillsDisplays: any;
  hiredLevel: any;
  textLength = 150;
  initialTextLength = 150;
  morelessText = 'More';
  jobDescrption: any;
  coverLetter: any;
  morelessCoverText = 'More';
  textCoverLength = 150;
  isLoaded = false;
  baseurl: any;
  hiredLevelTxt = inputData.hiredLevelFullTxt;

  attachmentFile = false;
  uploadedFileArr: any = [];
  attachment: any = [];
  filetype: any;
  image_url = constant.imgurl;

  job_id: any;
  answersList: any = [];
  answerResult: any;
  showAns: boolean = false;
  proposedUserId: any;
  userID = this.apiService.decodejwts().userid; // logged user id
  showWithDraw:boolean = false;
  showAccept:boolean = false;
  showReject:boolean = false;
  showHire:boolean = false;
  isAccepted:boolean = false;
  isRejected:boolean = false;
  isOffered:boolean = false;
  isRequest:boolean = false;

  responseData:any;

  results: any;
  errormessage: string = "";
  successmsg: string = "";
  is_success: boolean = false;
  freelancer_id: any;
  freelancer_email: any;
  profileDetails: any;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    public dialog: MatDialog,
    private usersService: UserService,
    private ratingConfig: NgbRatingConfig,
    private router: Router,
  ) {
      // customize default values of ratings used by this component tree
      this.ratingConfig.max = inputData.maximumRatingConfig;
      this.ratingConfig.readonly = true;
   }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.proposalId = params['proposalid'];
    });
    this.baseurl = constant.siteBaseUrl;
    const url = constant.apiurl + constant.job_proposal + this.proposalId;
    this.apiService.getRequest(url).subscribe(
      row => {
        this.resProposalData = row;
        if (this.resProposalData.status === 200 && this.resProposalData.ok === true) {
          this.proposalDetails = this.resProposalData.body;
          this.isLoaded = true;
          this.job_id = this.proposalDetails.job_id;
          this.proposedUserId = this.proposalDetails.user;
          console.log(this.resProposalData);
          console.log(this.proposalDetails);
          /** dont show proposal actions */
          if(this.userID == this.proposedUserId){ //proposed user
            this.showWithDraw = true;
          }
          if(this.userID == this.proposalDetails.job_user){ //Job owner
            this.showAccept = true;
            this.showReject = true;
            this.showHire = true;
            if(this.proposalDetails.offer_status == "Pending")
              this.isRequest = true;
            if(this.proposalDetails.offer_status == "Accept")
              this.isOffered = true;
            if(this.proposalDetails.status == 'Accept'){
              this.showWithDraw = true;
              this.showAccept = false;
              this.isAccepted = true;
            }
            if(this.proposalDetails.status == 'Cancel'){
              this.isRejected = true;
              this.showAccept = true;
              this.showReject = false;
            }
          }
          this.skillsDisplays = this.resProposalData.body.skills !== '' ? this.resProposalData.body.skills.split(',') : [];
          this.hiredLevel = this.resProposalData.body.experience_level;
          this.jobDescrption = this.resProposalData.body.description;
          this.coverLetter = this.resProposalData.body.cover_letter;
          // attachments start
          if ( !this.coverLetter || (this.coverLetter.length < this.initialTextLength)) {
            this.morelessCoverText = '';
          }
          if (this.jobDescrption.length < this.initialTextLength) {
            this.morelessText = '';
          }
          this.attachmentFile = this.resProposalData.body.attachments !== '' ? true : false;
          if (this.resProposalData.body.attachments != '') {
            const initialUploadedFile = this.resProposalData.body.attachments.split(',');
            this.uploadedFileArr = initialUploadedFile;
            this.getAttachments();
          }
          // attachments end
          this.getAnswers();
          //freelancer email
          this.apiService.getRequest(constant.apiurl + constant.get_user_details + this.proposedUserId).subscribe(
            data => {
              this.profileDetails = data;
              if (this.profileDetails.body != '') {
                this.freelancer_email = this.profileDetails.body.email;
                const sessionData = sessionStorage.getItem('form_category');
              }
            }, err => {
              console.log(err);
            });
        }
      }, err => {
        console.log(err);
      });
  }

  getAnswers() {
    this.apiService.getRequest(constant.apiurl + constant.jobAnswers + '?job=' + this.job_id + '&user=' + this.proposedUserId)
      .subscribe(resData => {
        this.answerResult = resData;
        if (this.answerResult.status === 200 && this.answerResult.ok === true) {
          if (this.answerResult.body.count > 0) {
            this.answersList = this.answerResult.body.results;
            this.showAns = true;
          }
        }
      }, err => {
        console.log(err);
      });
  }

  getAttachments() {
    if (this.uploadedFileArr.length > 0) {
      this.uploadedFileArr.forEach(element => {
        this.apiService.getRequest(constant.apiurl + constant.fileupload + element)
          .subscribe(resData => {
            // this.initialAttachement.push(responseData['body']);
            const edifiletype = resData['body']['file_ext'];
            let ifiletype;
            if (edifiletype === 'image/jpeg' || edifiletype == 'image/png' || edifiletype == 'image/jpg' || edifiletype == 'image/gif') {
              ifiletype = 'img';
              // fileItem['tempimage'] = this.DomSan.bypassSecurityTrustResourceUrl(url);
            } else if (edifiletype === 'video/x-matroska' || edifiletype === 'video/mp4') {
              ifiletype = 'video';
            } else if (edifiletype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || edifiletype === 'application/msword') {
              ifiletype = 'doc';
            } else if (edifiletype == 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
              ifiletype = 'pptx';
            } else if (edifiletype === 'text/csv' || edifiletype === 'application/vnd.ms-excel') {
              ifiletype = 'csv';
            } else if (edifiletype === 'application/pdf') {
              ifiletype = 'pdf';
            } else if (edifiletype === 'application/x-php') {
              ifiletype = 'php';
            } else if (edifiletype === 'application/zip') {
              ifiletype = 'zip';
            } else if (edifiletype === 'text/vnd.trolltech.linguist' || edifiletype === 'application/javascript') {
              ifiletype = 'js';
            } else if (edifiletype === 'application/sql') {
              ifiletype = 'sql';
            } else {
              ifiletype = 'none';
            }
            this.attachment.push({
              'id': resData['body']['id'],
              'file_name': resData['body']['file_name'],
              'filetype': ifiletype,
              'filepath': this.image_url + resData['body']['file']
            });
          });
      });
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

  onCoverMoreFun(textlength, findText) {
    if (findText === 'More') {
      this.textCoverLength = textlength;
      this.morelessCoverText = 'Less';
    } else {
      this.textCoverLength = 150;
      this.morelessCoverText = 'More';
    }
    this.morelessCoverText = this.morelessCoverText;
    if (this.coverLetter.length < this.initialTextLength) {
      this.morelessCoverText = '';
    }
  }
  withdrawProposal(){
    const dialogEditRate = this.dialog.open(WithdrawProposalComponent, {
      disableClose: true,
      data: {
        'user_type':'freelancer',
        'proposal_id':this.proposalId
      }
    });

    dialogEditRate.afterClosed().subscribe(result => {
      console.log(result);
      if (result.status === 'success') {
        
      }
    });
  }
  acceptProposal(){
    const params = {
      'status': 'Accept',
      'job': this.job_id,
      'id': this.proposalId
    };
    this.apiService.putRequest(constant.apiurl + constant.proposalacceptreject, params ).subscribe(row => {
      this.responseData = row;
     if(typeof this.responseData.error != 'undefined' && this.responseData.error != ""){
      this.usersService.snackErrorMessage(this.responseData.error);
     }else{
      this.showWithDraw = true;
      this.showAccept = false;
      this.isAccepted = true;
      this.usersService.snackMessage('Proposal has been accepted successfully');
     }
    });
  }
  rejectProposal(){
    const params = {
      'status': 'Cancel',
      'job': this.job_id,
      'id': this.proposalId
    };
    this.apiService.putRequest(constant.apiurl + constant.proposalacceptreject, params ).subscribe(row => {
     this.responseData = row;
     if(typeof this.responseData.error != 'undefined' && this.responseData.error != ""){
      this.usersService.snackErrorMessage(this.responseData.error);
     }else{
      this.isRejected = true;
      this.showAccept = true;
      this.showReject = false;
      this.showWithDraw = false;
      this.usersService.snackMessage('Proposal has been rejected successfully');
     }
    });
  }

  addRoom() {
      var href = constant.apiurl + constant.roomlisting;
      var params = {
        room_name: this.proposalDetails.name + '_'+ (this.freelancer_email).split('@')[0]+'_interview',
        room_message: 'Interview',
        invite_users: this.freelancer_email,
        user: this.apiService.decodejwts().userid,
        room_type: 'Chat',
        job : this.job_id,
      };
      console.log(params);
      this.apiService.postRequest(href, params).subscribe((result:any) => {
        console.log(result.id);
        this.router.navigate(['/chat-room/'+ result.id]);
        console.log('success');
      }, (error: HttpErrorResponse) => {
        // this.errormessage = error.error.invite_users["0"];
        if (error.status == 400){
          this.router.navigate(['/messages/']);
        }
        console.log('error');
      });
  }
}