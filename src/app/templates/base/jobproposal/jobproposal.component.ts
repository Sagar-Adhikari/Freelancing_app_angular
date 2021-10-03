import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatDialog, MatDialogRef, MatTooltipModule } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { FileUploader } from 'ng2-file-upload'; /* file upload */
import { ApiService } from '../../../services/api/api.service';
import { constant, inputData } from '../../../../data/constant';
import { country } from '../../../../data/country';
import { AnswerComponent } from './answer/answer.component';
import { UserService } from '../../../services/sync/user.service';

@Component({
  selector: 'app-jobproposal',
  templateUrl: './jobproposal.component.html',
  styleUrls: ['./jobproposal.component.css'],
  providers: [NgbRatingConfig] // add NgbRatingConfig to the component providers
})
export class JobproposalComponent implements OnInit {
  jobProposalForm: FormGroup;
  responseData;
  payment: any;
  PopupAnswerDialogRef: MatDialogRef<AnswerComponent>;
  project_hours = inputData.projectHours;
  // error message
  errorMsg = '';
  errorMsgArr: any = [];
  answerError: boolean = false;
  user_id: string = this.apiService.decodejwts().userid;
  job_id; responseDate: any = [];
  jobTitleName; jobDescrption; jobCreatedAt;
  jobCommitment: any; expComp;
  expSkills: any = [];
  skillists: any = []; mainCategory: any = [];
  skillsDisplays: any = [];
  countries: any = country.list;
  selectedCountry: any;
  hiredLevel: any = '';
  initialRate: any;
  remainingvalue: any;
  percentagevalue: any;
  @ViewChild('ratevalue') rate: any;
  formDataAssign: any;

  /* file upload */
  attachment: any = [];
  fileName;
  fileType;
  uploadedFileId: any = [];
  uploadedFileIdString = '';
  afterFileUploadProcessed = 0;
  sizeOfUploadedFile = 0;
  thumbimgvalue;
  public uploader: FileUploader = new FileUploader({
    url: constant.apiurl + constant.fileupload,
    headers: [{
      name: 'Authorization',
      value: this.authHeader
    }],
    additionalParameter: {
      user: this.user_id,
      type: 'Jobs'
    }
  });
  public get authHeader(): string {
    return `JWT ${localStorage.getItem('exp_token')}`;
  }
  /* file upload */


  commits = inputData.commits;
  complements = inputData.compliments;
  hiredLevelTxt = inputData.hiredLevelFullTxt;
  resfindPropose: any = [];
  question_id: any;
  questions: any = [];
  isLoaded: boolean = false;
  proposal_count: any;
  proposalFormat = inputData.proposalFormat;
  interviewingCount = 0;
  unansweredCount = 0;
  jobuser: any;
  clientInfo: any = 0;
  showClient: boolean = false;
  invite_sent: any;
  constructor(
    formBulider: FormBuilder,
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    private DomSan: DomSanitizer,
    public snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog,
    private ratingConfig: NgbRatingConfig,
    private userservice: UserService
  ) {
    this.jobProposalForm = formBulider.group({
      'bid_amount': [null],
      'project_hour': [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'cover_letter': [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'qa_block': [null]
    });
    // customize default values of ratings used by this component tree
    ratingConfig.max = inputData.maximumRatingConfig;
    ratingConfig.readonly = true;
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.job_id = params['term'];
    });

    // check user already proposed this job

    const check_url = constant.apiurl + constant.job_proposal + '?job=' + this.job_id + '&user=' + this.user_id;
    this.apiService.getRequest(check_url).subscribe(
      row => {
        this.resfindPropose = row;
        console.log(row);
        console.log(this.resfindPropose.body.count);
        if (this.resfindPropose.body.count > 0) {
          this.router.navigate(['/search/job']);
          this.userservice.snackMessage('You already proposed this job');
          return false;
        }
      });
    /* file upload */

    this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
      form.append('file_name', fileItem._file.name);
      form.append('file_ext', fileItem._file.type);
      // form.append('file_size' , fileItem._file.size);
    };

    this.uploader.onAfterAddingFile = (fileItem) => {
      const img_url = (window.URL) ? window.URL.createObjectURL(fileItem._file) : (window as any).webkitURL.createObjectURL(fileItem._file);
      fileItem.withCredentials = false;
      this.sizeOfUploadedFile = this.sizeOfUploadedFile + fileItem._file.size;
      // sizeOfUploadedFile
      // 10000000
      if (fileItem._file.type === 'image/png' || fileItem._file.type === 'image/jpeg' || fileItem._file.type === 'image/jpg' || fileItem._file.type === 'image/gif') {
        fileItem['filetype'] = 'img';
        fileItem['tempimage'] = this.DomSan.bypassSecurityTrustResourceUrl(img_url);
      } else if (fileItem._file.type === 'video/x-matroska' || fileItem._file.type === 'video/mp4') {
        fileItem['filetype'] = 'video';
      } else if (fileItem._file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileItem._file.type === 'application/msword') {
        fileItem['filetype'] = 'doc';
      } else if (fileItem._file.type === 'text/csv' || fileItem._file.type === 'application/vnd.ms-excel') {
        fileItem['filetype'] = 'csv';
      } else if (fileItem._file.type === 'application/pdf') {
        fileItem['filetype'] = 'pdf';
      } else if (fileItem._file.type === 'application/x-php') {
        fileItem['filetype'] = 'php';
      } else if (fileItem._file.type === 'application/zip') {
        fileItem['filetype'] = 'zip';
      } else if (fileItem._file.type === 'text/vnd.trolltech.linguist' || fileItem._file.type === 'application/javascript') {
        fileItem['filetype'] = 'js';
      } else if (fileItem._file.type === 'application/sql') {
        fileItem['filetype'] = 'sql';
      } else {
        fileItem['filetype'] = 'none';
      }
      if (this.attachment.length < 5) {
        this.attachment.push(fileItem);
      } else {
        this.userservice.snackMessage('You can only upload 5 files');
      }
      // fileItem.upload();
    };

    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      const responsePath = JSON.parse(response);
      if (responsePath.id != '' && typeof responsePath.id != 'undefined') {
        this.afterFileUploadProcessed = this.afterFileUploadProcessed + 1;
        this.uploadedFileId.push(responsePath.id);
        if (this.uploadedFileId.length > 0) {
          this.uploadedFileIdString = this.uploadedFileId.toString();
        }
        if (this.attachment.length == this.afterFileUploadProcessed) {
          this.formDataCallback(this.formDataAssign);
        }
      }
    };
    /* file upload */

    const url = constant.apiurl + constant.getindivualjobdetails + '/' + this.job_id + '/';
    this.apiService.getRequest(url).subscribe(
      row => {
        if (row['status'] === 200 && row['ok'] === true) {
          this.responseDate = row;
          this.jobTitleName = this.responseDate.body.name;
          this.jobDescrption = this.responseDate.body.description;
          this.payment = this.responseDate.body.payment;
          this.jobCommitment = this.responseDate.body.commitment;
          this.expComp = this.responseDate.body.expected_to_complete;
          this.mainCategory = this.responseDate.body.category_id;
          this.expSkills = this.responseDate.body.skills != '' ? this.responseDate.body.skills.split(',') : [];
          this.jobCreatedAt = this.responseDate.body.created;
          this.selectedCountry = this.responseDate.body.location;
          this.hiredLevel = this.responseDate.body.experience_level;
          this.question_id = this.responseDate.body.question_id;
          this.rate.nativeElement.value = this.responseDate.body.payment_amount;
          this.proposal_count = this.responseDate.body.proposal_count;
          this.interviewingCount = this.responseDate.body.interview_count;
          this.unansweredCount = this.responseDate.body.unanswer_user;
          this.invite_sent = this.responseDate.body.invite_sent;
          this.jobuser = this.responseDate.body.user;
          this.getClientInfo();
          this.calculaterate();
          this.getSkills();
          this.getQuestions();
        }
      });
  }
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

  formDataCallback(formData) {
    const URL = constant.apiurl + constant.job_proposal;
    const params = {
      'user': this.user_id,
      'job': this.job_id,
      'cover_letter': formData.cover_letter,
      'expected_to_complete': formData.project_hour,
      'bid_amount': formData.bid_amount,
      'attachments': this.uploadedFileIdString,
      'status': 'Request'
    };
    this.apiService.postRequest(URL, params).subscribe(
      row => {
        if (row['id'] != '' && row['id'] != null) {
          this.router.navigate(['/search/job']);
          this.userservice.snackMessage('Your Proposal Sent to Client');
        } else {
          // console.log('error in job post');
        }
      },
      err => {
        if (err['error'][0] == 'not enough connects') {
          this.router.navigate(['/setting/membership']);
          this.userservice.snackErrorMessage('Not enough connects for submit proposal. Upgrade your membership plan');
        } else if (err['error']['non_field_errors'] != '') {
          this.userservice.snackErrorMessage(err['error']['non_field_errors'][0]);
        }
      });
  }

  calculaterate() {
    if (this.rate.nativeElement.value > 0 && this.rate.nativeElement.value !== '' && this.rate.nativeElement.value !== null) {
      this.percentagevalue = this.rate.nativeElement.value * 20 / 100;
      this.percentagevalue = this.percentagevalue.toFixed(2);
      this.remainingvalue = this.rate.nativeElement.value - this.percentagevalue;
      this.remainingvalue = this.remainingvalue.toFixed(2);
    } else {
      this.percentagevalue = 0.00;
      this.remainingvalue = 0.00;
    }
  }

  isNumber(event) {
    if (event.which < 46 || event.which > 59) {
      event.preventDefault();
    } // prevent if not number/dot
    if (event.which == 46 && event.target.value.indexOf('.') != -1) {
      event.preventDefault();
    }
    const twoDigit = parseFloat(this.rate.nativeElement.value);
    const findLength = twoDigit.toString().split('.')[1];
    console.log(findLength);
    if (findLength != '' && typeof findLength !== 'undefined') {
      if (findLength.length > 1) {
        this.rate.nativeElement.value = twoDigit.toFixed(1);
      }
    }
  }

  fileSelected(e: any): void {
    // console.log(e[0]);
  }

  onDeleteAttachment(index) {
    this.attachment.splice(index, 1);
  }

  getSkills() {
    this.apiService.getRequest(constant.apiurl + constant.getallskill + '?category=' + this.mainCategory)
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

  onSubmitProposal(formData) {
    this.errorMsg = '';
    if(!formData.bid_amount){
        formData.bid_amount = this.rate.nativeElement.value;
    }
    if (this.jobProposalForm.valid) {
      this.formDataAssign = formData;

      if(this.formDataAssign.bid_amount < 1){
        this.userservice.snackMessage('Hourly rate below 1 hr is Not valid');
        return false;
      }

      if (this.question_id) {
        // this.answertheQuestionPopup();
        this.collectQuestionAnswers();
      } else {
        this.finalProposalSubmit();
      }
    } else {
      this.errorMsg = 'error';
    }
  }
  finalProposalSubmit() {
    // After file uploads submit form
    if (this.attachment.length > 0) {
      this.attachment.forEach(file => {
        file.upload();
      });
    } else {
      this.formDataCallback(this.formDataAssign);
    }
  }
  collectQuestionAnswers() {
    let isError = false;
    const tempArr = this.questions;
    tempArr.forEach(function (item, index) {
      if (item.answer == "" && item.type == "Required") {
        tempArr[index].error = true;
        tempArr[index].errormsg = "Answer the question";
        isError = true;
        return false;
      } else {
        tempArr[index].error = false;
        tempArr[index].errormsg = "";
      }
    });
    if (!isError) {
      this.saveAnswer();
    }
  }
  saveAnswer() {
    const tempArr = this.questions;
    if (tempArr.length > 0) {
      tempArr.forEach(element => {
        let params = { 'user': this.user_id, 'job': this.job_id, 'question': element.question_id, 'answer': element.answer };
        this.apiService.putRequest(constant.apiurl + constant.jobAnswerUpdate, params)
          .subscribe(responseData => {
            console.log(responseData);
          });
      });
    }
    this.finalProposalSubmit();
  }
  answertheQuestionPopup() {
    this.PopupAnswerDialogRef = this.dialog.open(AnswerComponent, {
      disableClose: true,
      data: { 'question_id': this.question_id, 'job_id': this.job_id }
    });
    this.PopupAnswerDialogRef.afterClosed().subscribe(result => {
      if (result == 'success') {
        this.finalProposalSubmit();
      } else {
        this.answerError = true;
      }
    });
  }
  getQuestions() {
    /* Question Pre-populated Start */
    if (this.question_id != '') {
      const selectedQuestionArray = this.question_id.split(',');
      if (selectedQuestionArray.length > 0) {
        selectedQuestionArray.forEach(element => {
          this.apiService.getRequest(constant.apiurl + constant.jobQuestions + element)
            .subscribe(responseData => {
              const quesData = responseData['body'];
              this.questions.push({ 'question_id': quesData.id, 'question': quesData.question, 'type': (quesData.type != null) ? quesData.type : inputData.defaultQuestionType, 'answer': "", 'error': false, 'errormsg': "" });
              this.isLoaded = true;
            });
        });
      }
    }
  }

  geterrorMsg(field) {
    return this.jobProposalForm.controls[field].hasError('required')
      || this.jobProposalForm.controls[field].hasError('whitespace') ? 'Field is required' : '';
  }

  onClickCancel() {
    this.router.navigate(['/jobdetail/'+this.job_id]);
  }
  skillBasedSearch(skill) {
    this.router.navigate(['/search/job'], { queryParams: { skill: skill }, queryParamsHandling: 'merge' });
  }

}
