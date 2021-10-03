import { Component, OnInit, ViewChild, ComponentFactoryResolver, ViewContainerRef, HostListener } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ApiService } from '../../../../services/api/api.service';
import { constant, inputData } from '../../../../../data/constant';
import { country } from '../../../../../data/country';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpEvent } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClientModule, HttpHeaders, HttpResponse, HttpXsrfTokenExtractor } from '@angular/common/http';
import { DynamicquestionComponent } from '../dynamicquestion/dynamicquestion.component';
import { SuggestquestionComponent } from '../suggestquestion/suggestquestion.component';

import { FileUploader } from 'ng2-file-upload'; // file upload

@Component({
  selector: 'app-reusepost',
  templateUrl: './reusepost.component.html',
  styleUrls: ['./reusepost.component.css']
})
export class ReusepostComponent implements OnInit {
  siteBaseUrl = constant.siteBaseUrl;
  panelOpenState = false;
  maincategory: string;
  categorylists: any;
  subcategory: string;
  maincategory_id: string;
  subcategory_id: string;
  frreeerrormessage: string;
  project_title: string = localStorage.getItem('title');
  typeprojects: any;
  defaulttype: string;
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
  resourceCount;
  lifecycles: any;
  exps: any;
  defaultexp: string;
  integrations: any;
  integrationstring = '';
  integrationsocial: any;
  apintegrationArray: any = [];
  apideviceArray: any = [];
  apidevicestring = '';
  skillists: any;
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
  attachment: any[] = [];
  user_id: string = this.apiService.decodejwts().userid;
  image: any;
  options: any;
  questionoptions: any;
  defaultquestion: string;
  questions: any = [];
  onstatus = true;
  budgetamount;
  skillstring = '';
  skillscreate: any = [];
  questionidArray: any = [];
  getspecificquestions: any;
  questionidstring = '';
  suggestQuestionArray: any = [];
  // edit page changes
  job_id: string;
  patchFormValue: any;
  defaultpostview: string;
  defaultSelectSkill: any = [];
  allowReload = false;
  newjobpostForm: FormGroup;
  PopupDialogRef: MatDialogRef<DynamicquestionComponent>;
  PopupSuggestQuestionRef: MatDialogRef<SuggestquestionComponent>;

  // success/error/disable submit button option
  errormessage: string;
  ismessage = false;
  is_success = false;
  notvalid = true;
  image_url = constant.imgurl;
  /* file upload */
  filetype;
  newUploadFileID: any = [];
  uploadedFileId: any = [];
  uploadedFileIdString = '';
  afterFileUploadProcessed = 0;
  initialAttachement: any = [];
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

  // validation message display
  errorMsg = '';
  errorMsgArr: any;
  /** invite user details initail value */
  inviteUserlists: any;
  invitesearch: any;
  inviteRes: any;
  inviteUsers: any;
  inviteUserString: string;
  selectedInviteUsers: any = [];

  otherOsInput: any = "";
  showOtherOption: boolean = false;
  public get authHeader(): string {
    return `JWT ${localStorage.getItem('exp_token')}`;
  }
  /* file upload */

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private http: HttpClient,
    private dialog: MatDialog,
    private router: Router,
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

  getInitialCategoryList() {
    this.apiService.getRequest(constant.apiurl + constant.job_category_all)
      .subscribe(responseData => {
        this.categorylists = responseData['body'];
      });
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.allowReload) {
      return confirm('Discard changes?');
    }
    return true;
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(event) {
    return false;
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.job_id = params['term'];
    });
    // get initial form data - start
    const url = constant.apiurl + constant.getindivualjobdetails + '/' + this.job_id + '/';
    this.apiService.getRequest(url).subscribe(
      row => {
        if (row['status'] == 200 && row['ok'] == true) {
          this.patchFormValue = row['body'];
          this.newjobpostForm.patchValue({
            'name': this.patchFormValue.name,
            'description': this.patchFormValue.description,
            'attachments': '',
            'type': this.patchFormValue.type,
            'otherOs': this.patchFormValue.other_os,
            'resource': this.patchFormValue.resource,
            'life_cycle': this.patchFormValue.life_cycle,
            // 'experience': this.patchFormValue.experience,
            'required_language': this.patchFormValue.required_language,
            'required_software': this.patchFormValue.required_software,
            // 'skills': this.patchFormValue.skills,
            // 'social_integration': this.patchFormValue.social_integration,
            'payment': this.patchFormValue.payment,
            'payment_amount': this.patchFormValue.payment_amount,
            'post_view': this.patchFormValue.post_view,
            'experience_level': this.patchFormValue.experience_level,
            'expected_to_complete': this.patchFormValue.expected_to_complete,
            'commitment': this.patchFormValue.commitment,
            // 'postview': this.patchFormValue.postview,
            'invite_user': this.patchFormValue.invite_user,
            // 'preference_type': this.patchFormValue.preference_type,
            // 'freelance_score': this.patchFormValue.freelance_score,
            // 'freelance_talent': this.patchFormValue.freelance_talent,
            // 'hours_billed_work': this.patchFormValue.hours_billed_work,
            'location': this.patchFormValue.location,
            // 'english_level': this.patchFormValue.english_level,
            'question_id': this.patchFormValue.question_id,
            'boost': this.patchFormValue.boost,
            'invitecoworker': this.patchFormValue.invitecoworker,
            'cover_letter': this.patchFormValue.cover_letter,
            'allow': this.patchFormValue.allow
          });
          if (this.patchFormValue.invite_user != '' && this.patchFormValue.invite_user != null) {
            this.selectedInviteUsers = this.patchFormValue.invite_user.split(',');
          }
          // add validation
          if (this.patchFormValue.payment === 'Fixed') {
            this.newjobpostForm.get('paymentbudget').setValidators(
              [Validators.required, Validators.pattern('^[+-]?([0-9]*[.])?[0-9]+$')]);
            this.newjobpostForm.get('paymentbudget').updateValueAndValidity();
          }
          /* Attachment file display - start*/
          if (this.patchFormValue.attachments != '' && this.patchFormValue.user == this.user_id) {
            const initialUploadedFile = this.patchFormValue.attachments.split(',');
            this.uploadedFileId = initialUploadedFile;
            if (this.uploadedFileId.length > 0) {
              this.uploadedFileId.forEach(element => {
                this.attachment.push({
                  'id': element
                });
              });
              this.uploadedFileIdString = this.uploadedFileId.toString();

              this.uploadedFileId.forEach(element => {
                this.apiService.getRequest(constant.apiurl + constant.fileupload + element)
                  .subscribe(responseData => {
                    // this.initialAttachement.push(responseData['body']);
                    const edifiletype = responseData['body']['file_ext'];
                    if (edifiletype === 'image/jpeg' || edifiletype == 'image/png' || edifiletype == 'image/jpg' || edifiletype == 'image/gif') {
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
                    const aIndex = this.attachment.findIndex(x => x.id == responseData['body']['id']);
                    this.attachment[aIndex] = {
                      'id': responseData['body']['id'],
                      'file_name': responseData['body']['file_name'],
                      'file_ext': responseData['body']['file_ext'],
                      'filetype': this.filetype,
                      'filepath': this.image_url + responseData['body']['file']
                    }
                  });
              });
            }
          }
          /* Attachment file display - end */
          this.maincategory_id = this.patchFormValue.category_id;
          this.getSkills();
          this.subcategory_id = this.patchFormValue.sub_categorie_id;
          /* Question Pre-populated Start */
          if (this.patchFormValue.question_id != '' && this.patchFormValue.user == this.user_id) {
            const selectedQuestionArray = this.patchFormValue.question_id.split(',');
            if (selectedQuestionArray.length > 0) {
              selectedQuestionArray.forEach(element => {
                this.apiService.getRequest(constant.apiurl + constant.jobQuestions + element)
                  .subscribe(responseData => {
                    const quesData = responseData['body'];
                    this.questions.push({ 'question_id': quesData.id, 'question': quesData.question, 'type': (quesData.type != null)?quesData.type:inputData.defaultQuestionType });
                  });
              });
            }
          }
          /* Question Pre-populated End */
          // Skills pre-populated start
          if (this.patchFormValue.skills != '') {
            this.defaultSelectSkill = this.patchFormValue.skills.split(',');
          }

          // Social Intagration pre-populated start
          let integrationsocialArr = [
            { 'key': 'Social Media', 'name': 'Social Media', 'checked': false },
            { 'key': 'Payment Processor', 'name': 'Payment Processor', 'checked': false },
            { 'key': 'Cloud Storage', 'name': 'Cloud Storage', 'checked': false },
            { 'key': 'Other', 'name': 'Other', 'checked': false }
          ];
          if (this.patchFormValue.social_integration != '') {
            const selectedSocialArray = this.patchFormValue.social_integration.split(',');
            const newSocialArr: any = [];
            if (selectedSocialArray.length > 0) {
              this.apintegrationArray = selectedSocialArray;
              integrationsocialArr = integrationsocialArr.map(x => { x.checked = selectedSocialArray.includes(x.key); return x; });
              this.integrations = integrationsocialArr;
            } else {
              this.integrations = integrationsocialArr;
            }
          } else {
            this.integrations = integrationsocialArr;
          }
          // Social Intagration pre-populated end
          if (this.patchFormValue.resource == 1 || this.patchFormValue.resource == null) {
            this.defaultresource = 1;
          } else {
            this.defaultresource = 0;
            this.resourcevalue = true;
            this.resourcecount = this.patchFormValue.resource;
          }
          this.defaultexp = this.patchFormValue.experience;
          /* Payment - start */
          if (this.patchFormValue.payment == 'Fixed') {
            this.fixedField = true;
          } else {
            this.fixedField = false;
          }
          this.defaultpay = this.patchFormValue.payment;
          this.budgetamount = this.patchFormValue.payment_amount;
          this.defaultpostview = this.patchFormValue.post_view;
          /* Payment - end */
          this.defaultpreference = this.patchFormValue.preference_type;
          this.defaultscore = this.patchFormValue.freelance_score;
          this.defaulttalent = this.patchFormValue.freelance_talent;
          this.defaultbilled = this.patchFormValue.hours_billed_work;
          this.defaultenglishlevel = this.patchFormValue.english_level;
          this.defaultquestion = 'no';
          this.onstatus = this.patchFormValue.status;
        }
      }
    );
    // get initial form data - end
    /* file upload */

    this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
      form.append('file_name', fileItem._file.name);
      form.append('file_ext', fileItem._file.type);
    };

    this.uploader.onAfterAddingFile = (fileItem) => {
      const url: any = (window.URL) ?
        window.URL.createObjectURL(fileItem._file) : (window as any).webkitURL.createObjectURL(fileItem._file);
      fileItem.withCredentials = false;
      // this.attachment.push(fileItem);
      fileItem.upload();
    };

    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      const responsePath = JSON.parse(response);
      if (responsePath.id != '' && typeof responsePath.id != 'undefined') {
        this.afterFileUploadProcessed = this.afterFileUploadProcessed + 1;
        this.uploadedFileId.push(responsePath.id);
        const addfiletype = responsePath.file_ext;
        if (addfiletype === 'image/jpeg' || addfiletype == 'image/png' || addfiletype == 'image/jpg' || addfiletype == 'image/gif') {
          this.filetype = 'img';
          // fileItem['tempimage'] = this.DomSan.bypassSecurityTrustResourceUrl(url);
        } else if (addfiletype === 'video/x-matroska' || addfiletype === 'video/mp4') {
          this.filetype = 'video';
        } else if (addfiletype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || addfiletype === 'application/msword') {
          this.filetype = 'doc';
        } else if (addfiletype === 'text/csv' || addfiletype === 'application/vnd.ms-excel') {
          this.filetype = 'csv';
        } else if (addfiletype === 'application/pdf') {
          this.filetype = 'pdf';
        } else if (addfiletype === 'application/x-php') {
          this.filetype = 'php';
        } else if (addfiletype === 'application/zip') {
          this.filetype = 'zip';
        } else if (addfiletype === 'text/vnd.trolltech.linguist' || addfiletype === 'application/javascript') {
          this.filetype = 'js';
        } else if (addfiletype === 'application/sql') {
          this.filetype = 'sql';
        } else {
          this.filetype = 'none';
        }
        this.attachment.push({
          'id': responsePath.id,
          'file_name': responsePath.file_name,
          'filetype': this.filetype,
          'filepath': this.image_url + responsePath.file
        });
        if (this.uploadedFileId.length > 0) {
          this.uploadedFileIdString = this.uploadedFileId.toString();
        }
        if (this.attachment.length == this.afterFileUploadProcessed) {
          // this.formDataCallback(this.formDataAssign);
        }
      }
    };
    /* file upload */

    this.getInitialCategoryList();

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
    this.paylists = [
      { 'key': 'Hourly', 'name': 'Pay by the hour' },
      { 'key': 'Fixed', 'name': 'Pay a fixed price' }
    ];
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
      { 'key': 'Agency', 'name': 'Agency - work through an agancy that manages freelancers.' }
    ];
    this.scores = [
      { 'key': 90, 'name': '90% Job Success & Up' },
      { 'key': 80, 'name': '80% Job Success & Up' }
    ];
    this.talents = [
      { 'key': 'include', 'name': 'Include Rising Talent' },
      { 'key': 'not', 'name': 'Don`t Include Rising Talent' }
    ];
    this.billeds = [
      { 'key': 0, 'name': 'Any amount' },
      { 'key': 1.00, 'name': 'Atleast 1 hour' },
      { 'key': 100.00, 'name': 'Atleast 100 hour' },
      { 'key': 500.00, 'name': 'Atleast 500 hour' },
      { 'key': 1000.00, 'name': 'Atleast 1,000 hour' },
    ];
    this.englishlevels = [
      { 'key': 'Elementary', 'name': 'Basic - Only communicates through written communication' },
      { 'key': 'Intermediate', 'name': 'Conversational - Able to verbally discuss project details' },
      { 'key': 'Advanced', 'name': 'Fluent - Complete language command with perfect grammar' },
      { 'key': 'Proficient', 'name': 'Native or Bilingual - Knowledge of idioms and colloquialisms' }
    ];
    this.questionoptions = [
      { 'key': 'no', 'name': 'Add Your Question' },
      { 'key': 'suggested', 'name': 'select from suggested option.' },
      { 'key': 'own', 'name': 'Create your own question.' }
    ];
    this.filterUserLists();
  }

  setHeaders() {
    return {
      headers: new HttpHeaders().set('Content-Type', 'multipart/form-data')
    };
  }

  selectFile(event) {
    const files = event.target.files || event.srcElement.files;
    this.image = files[0];
    const URL = constant.apiurl + constant.fileupload;
    const data = {
      user: this.user_id,
      file: this.image,
      type: 'Jobs'
    };
    this.http.post(URL, data, this.setHeaders()).subscribe(
      resp => console.log('response: ', resp),
      error => console.log(error)
    );
  }

  onDeleteAttachment(index) {
    if (this.attachment.length > 0) {
      this.attachment.splice(index, 1);
      this.newUploadFileID = [];
      this.attachment.forEach(element => {
        this.newUploadFileID.push(element.id);
      });
      this.uploadedFileIdString = this.newUploadFileID.toString();
    }
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
    if (selectedFreelancer != 1) {
      this.resourcevalue = true;
    } else {
      this.resourcevalue = false;
    }
  }

  getSkills() {
    this.apiService.getRequest(constant.apiurl + constant.getallskill + '?category=' + this.maincategory_id)
      .subscribe(responseData => {
        this.skillists = responseData['body'];
      });
  }

  onChangeIntegration(apivalue: string, e) {
    if (e.target.checked) {
      this.apintegrationArray.push(apivalue);
    } else {
      const value = this.apintegrationArray.find(x => x == apivalue);
      const index = this.apintegrationArray.indexOf(value);
      this.apintegrationArray.splice(index, 1);
    }
    this.integrationstring = this.apintegrationArray.toString();
  }

  onChangeDevice(apivalue: string, e) {
    if (e) {
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

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  onChangeQuestion(question) {
    if (question == 'own') {
      this.addquestion();
    } else if (question == 'suggested') {
      this.suggestquestion();
    }
  }

  suggestquestion() {
    this.PopupSuggestQuestionRef = this.dialog.open(SuggestquestionComponent, {
      disableClose: true,
      data: { 'method': 'add' }
    });

    this.PopupSuggestQuestionRef.afterClosed().subscribe(result => {
      if (result != '' && result != 'close') {
        result.forEach(element => {
          this.questions.push({ 'question_id': element.id, 'question': element.question, 'type': (element.type != null) ? element.type : inputData.defaultQuestionType });
        });
      }
    });
  }

  getQuestionList(questionArray) {
    this.questions = questionArray;
  }

  addquestion() {
    this.PopupDialogRef = this.dialog.open(DynamicquestionComponent, {
      disableClose: true,
      data: { 'method': 'add' }
    });
    this.PopupDialogRef.afterClosed().subscribe(result => {
      if (result != 'error' && result != '') {
        if (result != 'close') {
          this.questions.push({ 'question_id': result.id, 'question': result.question, 'type': result.type  });
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
      }
    });
  }

  deletequestion(questionID) {
    const qIndex = this.questions.findIndex(x => x.question_id == questionID);
    this.questions.splice(qIndex, 1);
    this.apiService.deleteRequest(constant.apiurl + constant.jobQuestions + questionID, {})
      .subscribe(responseData => {
        console.log(responseData);
      });
  }

  onStatusCall(status) {
    this.onstatus = status;
    if (status != 'Open') {
      this.onstatus = status;
    }
  }

  newjobpostFormSubmit(formData) {
    this.errorMsg = '';
    this.errorMsgArr = [];
    this.notvalid = true;
    this.resourceCount = formData.resource;
    if (this.resourceCount == 0) {
      this.newjobpostForm.get('resourcevaluevalid').setValidators([Validators.required]);
      this.newjobpostForm.get('resourcevaluevalid').updateValueAndValidity();
      if (formData.resourcevaluevalid == '' || formData.resourcevaluevalid == 0 || formData.resourcevaluevalid == null) {
        this.frreeerrormessage = 'Fields are required and should greater than 0';
        this.notvalid = false;
      } else {
        this.resourceCount = formData.resourcevaluevalid;
      }
    } else {
      this.newjobpostForm.get('resourcevaluevalid').clearValidators();
      this.newjobpostForm.get('resourcevaluevalid').updateValueAndValidity();
    }
    if (this.newjobpostForm.valid) {
      if (formData.skills != [] && typeof formData.skills != 'undefined') {
        const skills = formData.skills;
        this.skillstring = skills.toString();
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
      if (formData.invite_user != null && formData.invite_user != [] && typeof formData.invite_user != 'undefined' && this.defaultpostview === 'invite') {
        const inviteuserlists = formData.invite_user;
        this.inviteUserString = inviteuserlists.toString();
      }else{
        this.selectedInviteUsers = [];
        this.inviteUserString = '';
      }
      if (this.notvalid) {
        const URL = constant.apiurl + constant.savejobdetails;
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
          'resource': this.resourceCount,
          'life_cycle': formData.life_cycle,
          'experience': formData.experience,
          'required_language': formData.required_language,
          'required_software': formData.required_software,
          'skills': this.skillstring,
          'social_integration': this.integrationstring,
          'payment': formData.payment,
          'payment_amount': this.budgetamount,
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
              this.allowReload = true;
              this.showSuccess();
              this.router.navigate(['/joblisting']);
            } else {
              // console.log('error in job post');
            }
          });
      } else {
        // this.getFormMessage();
        this.showError();
      }
    } else {
      // console.log('error');
      // this.getFormMessage();
      this.showError();
    }

  }

  showSuccess() {
    this.is_success = true;
    setTimeout(() => {
      this.is_success = false;
    }, 2000);
  }

  showError() {
    this.errorMsg = 'error';
    // this.ismessage = true;
    // setTimeout(() => {
    //   this.ismessage = false;
    // }, 2000);
  }

  getFormMessage() {
    if (this.newjobpostForm.controls['name'].hasError('required')
      || this.newjobpostForm.controls['description'].hasError('required')
      || this.newjobpostForm.controls['type'].hasError('required')
      || this.newjobpostForm.controls['life_cycle'].hasError('required')
      || this.newjobpostForm.controls['experience'].hasError('required')
      || this.newjobpostForm.controls['experience_level'].hasError('required')
      || this.newjobpostForm.controls['expected_to_complete'].hasError('required')
    ) {
      this.errormessage = 'Fields are required';
    }
  }

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

  onClickCancel() {
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
            console.log(err);
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
        console.log(this.inviteUserlists);
      });
  }
}
