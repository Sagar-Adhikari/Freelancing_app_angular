import { Component, OnInit, ViewChild, ComponentFactoryResolver, ViewContainerRef, HostListener, ElementRef } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MatTooltipModule, MatSnackBar } from '@angular/material';
import { ApiService } from '../../../../services/api/api.service';
import { UserService } from '../../../../services/sync/user.service';
import { constant, inputData } from '../../../../../data/constant';
import { country } from '../../../../../data/country';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpEvent } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from "rxjs";
import { HttpClientModule, HttpHeaders, HttpResponse, HttpXsrfTokenExtractor } from '@angular/common/http';
import { DynamicquestionComponent } from '../dynamicquestion/dynamicquestion.component';
import { SuggestquestionComponent } from '../suggestquestion/suggestquestion.component';
import { forEach } from '@angular/router/src/utils/collection';
import { FileUploader } from 'ng2-file-upload'; /* file upload */
import { DomSanitizer } from '@angular/platform-browser';
import * as $ from 'jquery';

@Component({
  selector: 'app-postjobdetail',
  templateUrl: './postjobdetail.component.html',
  styleUrls: ['./postjobdetail.component.css']
})
export class PostjobdetailComponent implements OnInit {
  siteBaseUrl = constant.siteBaseUrl;
  panelOpenState = false;
  maincategory: string;
  subcategory: string;
  maincategory_id: string;
  subcategory_id: string;
  project_title: string = localStorage.getItem('title');
  typeprojects: any;
  defaulttype: string;
  frreeerrormessage: string;
  devices: any;
  ongoinglists: any;
  ongoingArray: any = [];
  onetimelists: any = [];
  isongoing = false;
  isonetime = false;
  otherFieldOngoing = false;
  otherFieldOneTime = false;
  resources: any;
  resourcevalue = false;
  defaultresource: any;
  resourcecount: string;
  lifecycles: any;
  exps: any;
  defaultexp: string;
  integrations: any;
  integrationstring = '';
  apintegrationArray: any = [];
  apideviceArray: any = [];
  apidevicestring = '';
  skillists: any;
  skillscreate: any = [];
  resultSkill: any = [];
  paylists: any;
  defaultpay: string;
  fixedField = false;
  exp_levels: any;
  exp_comps: any;
  commits: any;
  postviews: any;
  preferences: any;
  defaultpreference: string;
  scores: any;
  defaultscore: string;
  talents: any;
  defaulttalent: string;
  billeds: any;
  defaultbilled: number;
  defaultlocation: string;
  englishlevels: any;
  locations: any = country.list;
  defaultenglishlevel: string;
  attachment: any = [];
  user_id: string = this.apiService.decodejwts().userid;
  image: any;
  options: any;
  questionoptions: any;
  defaultquestion: string;
  questions: any = [];
  onstatus = true;
  
  skillstring = '';
  questionidArray: any = [];
  getspecificquestions: any;
  questionidstring = '';
  suggestQuestionArray: any = [];
  formDataAssign: any;

  newjobpostForm: FormGroup;
  PopupDialogRef: MatDialogRef<DynamicquestionComponent>;
  PopupSuggestQuestionRef: MatDialogRef<SuggestquestionComponent>;

  // success/error/disable submit button option
  errormessage: string;
  ismessage = false;
  is_success = false;
  notvalid = true;

  otherOsInput: any = "";
  showOtherOption: boolean = false;
  defaultpostview: any = 'public';
  /* file upload */
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
  // validation message display
  errorMsg = '';
  errorMsgArr: any;
  /** invite user details initail value */
  initialInviteSearch: any;
  inviteUserlists: any;
  invitesearch: any;
  inviteRes: any;
  inviteUsers: any;
  inviteUserString: string;
  disableButton = false;
  tempques = [];
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private http: HttpClient,
    private dialog: MatDialog,
    private router: Router,
    private userService: UserService,
    private DomSan: DomSanitizer,
    private el: ElementRef,
    private snackBar : MatSnackBar
  ) {
    this.newjobpostForm = fb.group({
      'name': [this.project_title, Validators.compose([Validators.required])],
      'description': [null, Validators.compose([Validators.required])],
      'attachments': [null],
      'type': [null, Validators.compose([Validators.required])],
      'os': [null],
      'otherOs': [null],
      'resource': [null],
      'resourcevaluevalid': '',
      'life_cycle': [null, Validators.compose([Validators.required])],
      'experience': [null, Validators.compose([Validators.required])],
      'required_language': [null],
      'required_software': [null],
      'skills': [null],
      'social_integration': [null],
      'payment': [null],
      'paymentbudget': [null, Validators.compose([Validators.required])],
      'amount': [null],
      'experience_level': [null, Validators.compose([Validators.required])],
      'expected_to_complete': [null, Validators.compose([Validators.required])],
      'commitment': [null, Validators.compose([Validators.required])],
      'post_view': [null],
      'invite_user': [null],
      'preference_type': [null],
      'freelance_score': [null],
      'freelance_talent': [null],
      'hours_billed_work': [null],
      'location': [null],
      'english_level': [null],
      'question_id': [null],
      'boost': [false],
      'invitecoworker': [null],
      'cover_letter': [false],
      'allow': [false]
    });
  }

  canDeactivate(): Observable<boolean> | boolean {
    this.removeLocalStorage();
    return confirm('Discard changes?');
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(event) {
    return false;
  }

  @HostListener('window:unload', ['$event'])
  unloadHandler(event) {
    this.removeLocalStorage();
    return false;
  }

  ngOnInit() {
    if (!localStorage.getItem('category')) {
      this.router.navigate(['/postjob']);
    }
    /* file upload */

    this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
      form.append('file_name', fileItem._file.name);
      form.append('file_ext', fileItem._file.type);
    };

    this.uploader.onAfterAddingFile = (fileItem) => {
      const url = (window.URL) ? window.URL.createObjectURL(fileItem._file) : (window as any).webkitURL.createObjectURL(fileItem._file);
      fileItem.withCredentials = false;
      this.sizeOfUploadedFile = this.sizeOfUploadedFile + fileItem._file.size;
      // sizeOfUploadedFile
      // 10000000
      if (fileItem._file.type === 'image/png' || fileItem._file.type === 'image/jpeg' || fileItem._file.type === 'image/jpg' || fileItem._file.type === 'image/gif') {
        fileItem['filetype'] = 'img';
        fileItem['tempimage'] = this.DomSan.bypassSecurityTrustResourceUrl(url);
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
        this.userService.snackErrorMessage('You can only upload 5 files.');
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

    this.maincategory_id = localStorage.getItem('category');
    this.subcategory_id = localStorage.getItem('subcategory');
    this.maincategory = localStorage.getItem('category_name');
    this.subcategory = localStorage.getItem('subcategory_name');

    this.typeprojects = [
      { 'key': 'On Time', 'name': 'One-time project' },
      { 'key': 'On Going', 'name': 'Ongoing project' },
      { 'key': 'Not Sure', 'name': 'I am not  sure' }
    ];
    this.defaulttype = 'Not Sure';
    this.devices = [
      { 'key': 'iphone', 'name': 'iPhone' },
      { 'key': 'ipad', 'name': 'iPad' },
      { 'key': 'android', 'name': 'Android' },
      { 'key': 'windows', 'name': 'Windows Phone' },
      { 'key': 'blackberry', 'name': 'Blackberry' },
      { 'key': 'others', 'name': 'Others' },
    ];
    this.ongoinglists = [
      { 'key': 'designer', 'name': 'Designer' },
      { 'key': 'developer', 'name': 'Developer' },
      { 'key': 'project_manager', 'name': 'Project Manager' },
      { 'key': 'business', 'name': 'Business Analyst' },
      { 'key': 'qa', 'name': 'Q/A' },
      { 'key': 'other', 'name': 'Other' }
    ];
    this.onetimelists = [
      { 'key': 'bug', 'name': 'Fix a bug' },
      { 'key': 'install', 'name': 'Install/Integrate Software' },
      { 'key': 'scratch', 'name': 'Develop Website from scratch' },
      { 'key': 'landing', 'name': 'Creating a landing page' },
      { 'key': 'other', 'name': 'Other' }
    ];
    this.resources = [
      { 'key': 1, 'name': 'I want to hire one freelancer' },
      { 'key': 0, 'name': 'I need to hire more than one freelancer' },
    ];
    this.defaultresource = 1;
    this.lifecycles = [
      { 'key': 'design', 'name': 'I have designs' },
      { 'key': 'specification', 'name': 'I have specifications' },
      { 'key': 'na', 'name': 'N/A' },
      { 'key': 'idea', 'name': 'I have an idea' }
    ];
    this.exps = [
      { 'key': 'yes', 'name': 'Yes' },
      { 'key': 'no', 'name': 'No' }
    ];
    this.defaultexp = 'yes';
    this.getSkills();
    this.integrations = [
      { 'key': 'social', 'name': 'Social Media' },
      { 'key': 'payment', 'name': 'Payment Processor' },
      { 'cloud': 'na', 'name': 'Cloud Storage' },
      { 'other': 'idea', 'name': 'Other' }
    ];
    this.paylists = [
      { 'key': 'Hourly', 'name': 'Pay by the hour' },
      { 'key': 'Fixed', 'name': 'Pay a fixed price' }
    ];
    this.defaultpay = 'Hourly';
    this.exp_levels = [
      { 'key': 'Entry', 'name': 'Entry Level' },
      { 'key': 'Intermediate', 'name': 'Intermediate' },
      { 'key': 'Expert', 'name': 'Expert' }
    ];
    this.exp_comps = [
      { 'key': '>6', 'name': 'More than 6 months' },
      { 'key': '3-6', 'name': '3 to 6 months' },
      { 'key': '1-3', 'name': '1 to 3 months' },
      { 'key': '<6', 'name': 'less than 1 month' },
      { 'key': '<1', 'name': 'less than 1 week' }
    ];
    this.commits = [
      { 'key': '>30', 'name': 'More than 30 hrs/week' },
      { 'key': '<30', 'name': 'Less than 30 hrs/week' },
      { 'key': 'none', 'name': 'I don`t know yet' }
    ];
    this.postviews = inputData.postView;
    this.preferences = [
      { 'key': 'Independent', 'name': 'Independent - work with your freelancer directly.' },
      { 'key': 'Agency', 'name': 'Agency - work through an agency that manages freelancers.' }
    ];
    this.defaultpreference = 'Independent';
    this.scores = [
      { 'key': 90, 'name': '90% Job Success & Up' },
      { 'key': 80, 'name': '80% Job Success & Up' }
    ];
    this.defaultscore = '90';
    this.talents = [
      { 'key': 'include', 'name': 'Include Rising Talent' },
      { 'key': 'not', 'name': 'Don`t Include Rising Talent' }
    ];
    this.defaulttalent = 'include';
    this.billeds = [
      { 'key': 0, 'name': 'Any amount' },
      { 'key': 1.00, 'name': 'Atleast 1 hour' },
      { 'key': 100.00, 'name': 'Atleast 100 hour' },
      { 'key': 500.00, 'name': 'Atleast 500 hour' },
      { 'key': 1000.00, 'name': 'Atleast 1,000 hour' },
    ];
    this.defaultbilled = 0;

    this.englishlevels = [
      { 'key': 'Elementary', 'name': 'Basic - Only communicates through written communication' },
      { 'key': 'Intermediate', 'name': 'Conversational - Able to verbally discuss project details' },
      { 'key': 'Advanced', 'name': 'Fluent - Complete language command with perfect grammar' },
      { 'key': 'Proficient', 'name': 'Native or Bilingual - Knowledge of idioms and colloquialisms' }
    ];
    this.defaultenglishlevel = 'Intermediate';

    this.questionoptions = [
      { 'key': 'no', 'name': 'Add Your Question' },
      { 'key': 'suggested', 'name': 'Select from suggested option.' },
      { 'key': 'own', 'name': 'Create your own question.' }
    ];
    this.defaultquestion = 'no';
    this.filterUserLists();
  }

  onDeleteAttachment(index) {
    this.attachment.splice(index, 1);
  }

  onchangetype(selectedType) {
    if (selectedType == 'notsure') {
      this.isongoing = false;
      this.isonetime = false;
      this.otherFieldOngoing = false;
      this.otherFieldOneTime = false;
    } else {
      if (selectedType == 'ongoing') {
        this.otherFieldOneTime = false;
        this.isongoing = true;
        this.isonetime = false;
      } else {
        this.otherFieldOngoing = false;
        this.isongoing = false;
        this.isonetime = true;
      }
    }
  }

  onchangefreelancer(selectedFreelancer) {
    console.log(selectedFreelancer)
    if (selectedFreelancer != 1) {
      this.resourcevalue = true;
    } else {
      this.resourcevalue = false;
      //this.resourcecount = selectedFreelancer;
    }
  }

  getSkills() {
    this.apiService.getRequest(constant.apiurl + constant.getallskill + '?category=' + this.maincategory_id)
      .subscribe(responseData => {
        this.skillists = responseData['body'];
      });
  }

  onChangeIntegration(apivalue: string, isChecked: boolean) {
    if (isChecked) {
      this.apintegrationArray.push(apivalue);
    } else {
      const value = this.apintegrationArray.find(x => x == apivalue);
      const index = this.apintegrationArray.indexOf(value);
      this.apintegrationArray.splice(index, 1);
    }
    this.integrationstring = this.apintegrationArray.toString();
  }

  onChangeDevice(apivalue: string, isChecked: boolean) {
    if (isChecked) {
      this.apideviceArray.push(apivalue);
      if (apivalue == 'others') {
        this.showOtherOption = true;
      }
    } else {
      const value = this.apideviceArray.find(x => x == apivalue);
      const index = this.apideviceArray.indexOf(value);
      this.apideviceArray.splice(index, 1);
      if (apivalue == 'others') {
        this.showOtherOption = false;
      }
    }
    this.apidevicestring = this.apideviceArray.toString();
  }

  onchangeonetime(selectedOnetime) {
    if (selectedOnetime == 'other') {
      this.otherFieldOneTime = true;
    } else {
      this.otherFieldOneTime = false;
    }
  }

  onChangeOngoing(ongoingvalue: string, isChecked: boolean) {
    if (isChecked) {
      this.ongoingArray.push(ongoingvalue);
      if (ongoingvalue == 'Other') {
        this.otherFieldOngoing = true;
      }
    } else {
      const value = this.ongoingArray.find(x => x == ongoingvalue);
      const index = this.ongoingArray.indexOf(value);
      this.ongoingArray.splice(index, 1);
      if (ongoingvalue == 'Other') {
        this.otherFieldOngoing = false;
      }
    }
  }

  onChangePayment(paymentValue) {
    if (paymentValue == 'Fixed') {
      this.fixedField = true;
      this.newjobpostForm.get('paymentbudget').setValidators(
        [Validators.required, Validators.pattern('^[+-]?([0-9]*[.])?[0-9]+$')]);
      this.newjobpostForm.get('paymentbudget').updateValueAndValidity();
    } else {
      this.fixedField = false;
      this.newjobpostForm.get('paymentbudget').clearValidators();
      this.newjobpostForm.get('paymentbudget').updateValueAndValidity();
    }
  }


  onChangeQuestion(question) {
    if (question == 'own') {
      this.addquestion();
    } else if (question == 'suggested') {
      this.suggestquestion();
    }
  }

  suggestquestion() {
    console.log(this.tempques);
    this.PopupSuggestQuestionRef = this.dialog.open(SuggestquestionComponent, {
      disableClose: true,
      data: { 'method': 'add' ,'makechecked':this.tempques}
    });
    this.PopupSuggestQuestionRef.afterClosed().subscribe(result => {
      if (result != '' && result != 'close') {
        result.forEach(element => {

          //  let i:number = 0;
          //  this.questions.map((data,index) =>{
          //    // console.log(this.questions)
          //    if(data.question == element.question){
          //      i = 1;
          //      this.questions.splice(index,1)
          //      return false;
          //    }
          //  });
          //  if(i == 0){
             this.questions.push({ 'question_id': element.id, 'question': element.question, 'type': (element.type != null) ? element.type : inputData.defaultQuestionType });
             this.tempques.push(element.question);
          //  }
          // this.questionidArray.push({ 'question_id': element.id, 'question': element.question, 'type': (element.type != null) ? element.type : inputData.defaultQuestionType });
        });
        // this.getQuestionList(this.questionidArray);
      }
    });
  }

  getQuestionList(questionArray) {
    this.questions.push(questionArray);
  }

  addquestion() {
    this.PopupDialogRef = this.dialog.open(DynamicquestionComponent, {
      disableClose: true,
      data: { 'method': 'add' }
    });
    this.PopupDialogRef.afterClosed().subscribe(result => {
      if (result != 'error' && result != '') {
        if (result != 'close') {
          this.questions.push({ 'question_id': result.id, 'question': result.question, 'type': result.type });
          // this.getQuestionList(this.questionidArray);
        }
      } else {
        // console.log('error on add question');
      }
    });
  }

  editquestion(questionID) {
    const qIndex = this.questions.findIndex(x => x.question_id == questionID);
    const getspecificquestion = this.questions[qIndex];
    this.PopupDialogRef = this.dialog.open(DynamicquestionComponent, {
      disableClose: true,
      data: { 'method': 'edit', 'question_id': questionID, 'question_name': getspecificquestion.question, 'type': (getspecificquestion.type != null) ? getspecificquestion.type : inputData.defaultQuestionType }
    });
    this.PopupDialogRef.afterClosed().subscribe(result => {
      if (result != 'error' && result != 'close' && result != '') {
        this.questions[qIndex] = { 'question_id': result.id, 'question': result.question, 'type': (result.type != null) ? result.type : inputData.defaultQuestionType };
        this.tempques[qIndex] = result.question;
      }
    });
  }

  deletequestion(questionID) {
    const qIndex = this.questions.findIndex(x => x.question_id == questionID);
    this.questions.splice(qIndex, 1);
    this.tempques.splice(qIndex, 1);
    this.apiService.deleteRequest(constant.apiurl + constant.jobQuestions + questionID, {})
      .subscribe(responseData => {
        // console.log(responseData);
      });
  }

  onStatusCall(status) {
    this.onstatus = status;
    if (status != 'Open') {
      this.onstatus = status;
    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }


  newjobpostFormSubmit(formData) {

    this.disableButton = true;
    this.errorMsg = '';
    this.inviteUserString = '';
    this.errorMsgArr = [];
    this.notvalid = true;
    const resourceCount = formData.resource;
    if (resourceCount == 0) {
      this.newjobpostForm.get('resourcevaluevalid').setValidators([Validators.required]);
      this.newjobpostForm.get('resourcevaluevalid').updateValueAndValidity();
      if (formData.resourcevaluevalid == '' || formData.resourcevaluevalid == 0 || formData.resourcevaluevalid == null) {
        this.frreeerrormessage = 'Fields are required and should greater than 0';
        this.notvalid = false;
      } else {
        this.resourcecount = formData.resourcevaluevalid;
      }
    } else {
      this.newjobpostForm.get('resourcevaluevalid').clearValidators();
      this.newjobpostForm.get('resourcevaluevalid').updateValueAndValidity();
    }
    if (this.newjobpostForm.valid) {
      if (formData.skills != null && formData.skills != [] && typeof formData.skills != 'undefined') {
        const skills = formData.skills;
        let skil= [];
        skills.forEach(element =>{
          skil.push(element.name)
        })
        this.skillstring = skil.toString();
      }
      if (formData.invite_user != null && formData.invite_user != [] && typeof formData.invite_user != 'undefined' && this.defaultpostview === 'invite') {
        const inviteuserlists = formData.invite_user;
        this.inviteUserString = inviteuserlists.toString();
      }else{
        this.inviteUserString = '';
      }
      if (this.questions.length > 0) {
        const getQuestionName: any = [];
        this.questions.forEach(element => {
          getQuestionName.push(element.question_id);
        });
        if (getQuestionName.length > 0) {
          this.questionidstring = getQuestionName.toString();
        }
      }
      if (this.notvalid) {
        this.formDataAssign = formData;
        // After file uploads submit form
        if (this.attachment.length > 0) {
          this.attachment.forEach(file => {
            file.upload();
          });
        } else {
          this.formDataCallback(this.formDataAssign);
        }
      } else {
        // this.getFormMessage();
        this.showError();
        this.disableButton = false;
      }
    } else {
      let el = $('.ng-invalid:not(form):first');
      $('html,body').animate({ scrollTop: (el.offset().top - 20) }, 'slow', () => {
        el.focus();
      });
      this.showError();
      this.disableButton = false;
    }
  }

  formDataCallback(formData) {
    const URL = constant.apiurl + constant.savejobdetails;
    
  if(this.resourcecount == undefined){
    this.resourcecount = this.defaultresource;
  }

  if(parseInt(this.resourcecount) < 1){
    
    let el = $('#NeedtoHireId');
    $('html,body').animate({ scrollTop: (el.offset().top - 20) }, 'slow', () => {
      el.focus();
    });
    this.disableButton = false;
    this.snackBar.open('Please enter a value greater than 0');
    setTimeout(() => {
      this.snackBar.dismiss();
    }, 1500);
    return false;
  }
    const params = {
      'user': this.user_id,
      'categori_id': this.maincategory_id,
      'sub_categori_id': this.subcategory_id,
      'name': formData.name,
      'description': formData.description,
      'attachments': this.uploadedFileIdString,
      'type': formData.type,
      'os': this.apidevicestring,
      'other_os': formData.otherOs,
      'resource': this.resourcecount,
      'life_cycle': formData.life_cycle,
      'experience': formData.experience,
      'required_language': formData.required_language,
      'required_software': formData.required_software,
      'skills': this.skillstring,
      'social_integration': this.integrationstring,
      'payment': formData.payment,//'Fixed', always set as Fixed
      'payment_amount': formData.paymentbudget,
      'post_view': formData.post_view,
      'experience_level': formData.experience_level,
      'expected_to_complete': formData.expected_to_complete,
      'commitment': formData.commitment,
      'invite_user': this.inviteUserString,
      'preference_type': formData.preference_type,
      'freelance_score': formData.freelance_score,
      'freelance_talent': formData.freelance_talent,
      'hours_billed_work': 0,//can be removed from database table later
      'location': formData.location,
      'english_level': formData.english_level,
      'question_id': this.questionidstring,
      'boost': formData.boost,
      'cover_letter': formData.cover_letter,
      'status': this.onstatus
    };

    this.apiService.postRequest(URL, params).subscribe(
      row => {
        if (row['id'] != '' && row['id'] != null) {
          // this.showSuccess();
          this.disableButton = false;
          this.onClickCancel();
          this.userService.snackMessage('New post created successfully.');
        } else {
          // console.log('error in job post');
          this.disableButton = false;
        }
      });
  }

  // showSuccess() {
  //   this.is_success = true;
  //   setTimeout(() => {
  //     this.is_success = false;
  //   }, 2000);
  // }

  showError() {
    this.errorMsg = 'error';
    // const x: Element = document.querySelector('#newpostjobForm');
    // if (x) {
    //     x.scrollIntoView({behavior: 'smooth'});
    // }
    // this.ismessage = true;
    // setTimeout(() => {
    //   this.ismessage = false;
    // }, 3000);
  }

  // getFormMessage() {
  //   if (this.newjobpostForm.controls['commitment'].hasError('required')
  //   || this.newjobpostForm.controls['name'].hasError('required')
  //   || this.newjobpostForm.controls['description'].hasError('required')
  //   || this.newjobpostForm.controls['type'].hasError('required')
  //   || this.newjobpostForm.controls['life_cycle'].hasError('required')
  //   || this.newjobpostForm.controls['experience'].hasError('required')
  //   || this.newjobpostForm.controls['experience_level'].hasError('required')
  //   || this.newjobpostForm.controls['expected_to_complete'].hasError('required') ) {
  //     this.errormessage = 'Fields are required';
  //   }
  // }

  geterrorMsg(field) {
    if (field == 'resourcevaluevalid') {
      return this.newjobpostForm.controls[field].hasError('required') ? 'You must enter a freelencer' : '';
    } else if (field == 'paymentbudget') {
      return this.newjobpostForm.controls[field].hasError('required')
        || this.newjobpostForm.controls[field].hasError('pattern') ? 'You must enter valid price' : '';
    } else {
      return this.newjobpostForm.controls[field].hasError('required') ? 'You must enter a value' : '';
    }
  }

  onClickEdit() {
    this.removeLocalStorage();
    localStorage.setItem('firstpostck','true');
    this.router.navigate(['/postjob']);
  }

  removeLocalStorage() {
    localStorage.removeItem('category');
    localStorage.removeItem('subcategory');
    localStorage.removeItem('category_name');
    localStorage.removeItem('subcategory_name');
    localStorage.removeItem('title');
  }

  onClickCancel() {
    this.removeLocalStorage();
    this.router.navigate(['/joblisting']);
  }

  public fileSelected(e: any): void {
    // console.log(e[0]);
  }

  onChangeSkills(event) {

    this.skillscreate = [];
    event.forEach(element => {
      if (element.id == null) {
        const params = {
          'name': element.name,
          'category': this.maincategory_id,
          'status': 'Active'
        };
        const skillcreateURL = constant.apiurl + constant.skills_creation;
        this.apiService.postRequest(skillcreateURL, params).subscribe(
          row => {
            this.resultSkill = row;
            this.skillscreate.push(this.resultSkill.id);
            this.skillstring = this.skillscreate.toString();
          },
          err => {
            // console.log(err);
          });
      } else {
        this.skillscreate.push(element.id);
        
        this.skillstring = this.skillscreate.toString();
      }
    });
  }

  filterUserLists(search = '') {
    this.apiService.getRequest(constant.apiurl + constant.invitesearch + '?search=' + search + '&register_type=Work&is_active=true')
      .subscribe(responseData => {
        this.inviteRes = responseData;
        this.inviteUserlists = this.inviteRes.body;
        // console.log(this.inviteUserlists);
      });
  }

  // displayname(invite) {
  //   if (invite != null) {
  //     this.initialInviteSearch = invite.email;
  //     return invite.email;
  //   }
  // }

  // onChangeInviteUser(event) {
  //   this.inviteUsers = [];
  //   event.forEach(element => {
  //       this.inviteUsers.push(element.id);
  //       this.inviteUserString = this.inviteUsers.toString();
  //   });
  //   console.log(this.inviteUserString);
  // }
}

