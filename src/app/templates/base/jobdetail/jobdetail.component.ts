import { Component, AfterViewInit, ViewChild, ChangeDetectorRef, ElementRef, Inject } from '@angular/core';
import { HttpHeaders, HttpResponse, HttpXsrfTokenExtractor, HttpClient } from '@angular/common/http';
import {
  MatSnackBar,
  MatTableDataSource,
  MatPaginator,
  MatSort,
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatIcon
} from '@angular/material';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { merge } from 'rxjs/observable/merge';
import { of as observableOf } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';
import { startWith } from 'rxjs/operators/startWith';
import { switchMap } from 'rxjs/operators/switchMap';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ApiService } from '../../../services/api/api.service';
import { UserService } from '../../../services/sync/user.service';
import { constant, inputData } from '../../../../data/constant';
import { Title, Meta, DOCUMENT } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteconfirmComponent } from './../postjob/deleteconfirm/deleteconfirm.component';
import { ViewpreviewComponent } from './viewpreview/viewpreview.component';

import { TruncatetextPipe } from './truncatetext.pipe';
import { country } from '../../../../data/country';
@Component({
  selector: 'app-jobdetail',
  templateUrl: './jobdetail.component.html',
  styleUrls: ['./jobdetail.component.css'],
  providers: [NgbRatingConfig] // add NgbRatingConfig to the component providers
})
export class JobdetailComponent implements AfterViewInit {
  job_id; responseDate: any = [];
  jobTitleName; jobDescrption; jobCreatedAt; payment; payment_amount;
  displayHourly: boolean = false;
  jobCommitment: any; expComp;
  expSkills: any = [];
  skillists: any = []; mainCategory: any = [];
  skillsDisplays: any = [];
  countries: any = country.list;
  selectedCountry: any;
  hiredLevel: any = '';
  findPropose = true;
  resfindPropose: any = [];
  user_id: any;
  question_id:any;
  questions:any = [];
  showQuestion:boolean = false;
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

  displayedColumns = ['jobtitle'];
  initialTable: InitialTable | null;
  dataSource = new MatTableDataSource(this.dataSource);
  resultsLength = 0;
  isLoadingResults = false;
  deleteDraftRes: any;
  deleteOpenRes: any;
  textLength = 150;
  initialTextLength = 150;
  morelessText = 'More';
  attachmentFile = false;
  uploadedFileArr: any = [];
  attachment: any = [];
  filetype: any;
  image_url = constant.imgurl;
  clientInfo: any;
  showClient = false;
  showOtherJobs: boolean = true;
  proposal_count: any;
  interviewingCount = 0;
  unansweredCount = 0;
  proposalFormat = inputData.proposalFormat;
  invite_sent: any = 0;
  displayColor = '';
  copylink: any;
  userAvailableConnect:any;
  siteConnect:any = 0;
  checkConnects : boolean = false;
  @ViewChild('dataPaginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;
  pagenumber: any;
  loggedUser: string;
  loggedUserType: any;
  isFreelancer: boolean = false;
  isAdmin: boolean = false;
  isClient:boolean =false;
  isSaved: boolean;
  responseSavePost: any;
  isInvited:boolean = false;
  interview_id: any;
  isNullUser:boolean = false;
  expToken:string='';
  constructor(
    private apiService: ApiService,
    private usersService: UserService,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private cdRef: ChangeDetectorRef,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    @Inject(DOCUMENT) private document: HTMLDocument,
    private titleService: Title,
    private router: Router,
    private route: ActivatedRoute,
    private ratingConfig: NgbRatingConfig
  ) {
    this.expToken=localStorage.getItem('exp_token');
    this.loggedUser = this.apiService.decodejwts().userid;
    // customize default values of ratings used by this component tree
    this.ratingConfig.max = inputData.maximumRatingConfig;
    this.ratingConfig.readonly = true;
    this.loggedUserType = localStorage.getItem('user_type');
    console.log(this.loggedUserType);
    if (this.loggedUserType == 'Freelancer')
      this.isFreelancer = true;
    if (this.loggedUserType == 'Admin')
      this.isAdmin = true;
    if(this.loggedUserType == 'Client')
      this.isClient = true;
    if(this.expToken == null){
      this.isNullUser = true;         
    } 
   }
 
  ngAfterViewInit() {
    if(this.sort == null) return null;
    this.initialTable = new InitialTable(this.http, this.apiService);
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 1);
    this.cdRef.detectChanges();
  }
  ngOnInit() {
    this.pagenumber = this.route.snapshot.queryParamMap.get('page') ? this.route.snapshot.queryParamMap.get('page') : '';
    this.activatedRoute.params.subscribe(params => {
      this.job_id = params['term'];
    });
    this.copylink = constant.siteBaseUrl + 'jobdetail/' + this.job_id;
    this.checkInvitedJob();
    const url = constant.apiurl + constant.getindivualjobdetails + '/' + this.job_id + '/';
    this.apiService.getRequest(url).subscribe(
      row => {
        if (row['status'] === 200 && row['ok'] === true) {
          this.responseDate = row;
          console.log(this.responseDate);
          this.jobTitleName = this.responseDate.body.name;
          this.jobDescrption = this.responseDate.body.description;
          if (this.jobDescrption.length < this.initialTextLength) {
            this.morelessText = '';
          }
          this.payment = this.responseDate.body.payment;
          if(this.payment == "Hourly"){
            this.displayHourly = true;
          }
          console.log(this.displayHourly);
          this.payment_amount = this.responseDate.body.payment_amount;
          this.jobCommitment = this.responseDate.body.commitment;
          this.expComp = this.responseDate.body.expected_to_complete;
          this.mainCategory = this.responseDate.body.category_id;
          this.question_id = this.responseDate.body.question_id;
          this.skillsDisplays = this.expSkills = this.responseDate.body.skills !== '' ? this.responseDate.body.skills.split(',') : [];
          this.jobCreatedAt = this.responseDate.body.created;
          this.selectedCountry = this.responseDate.body.location;
          this.hiredLevel = this.responseDate.body.experience_level;
          this.proposal_count = this.responseDate.body.proposal_count;
          this.interviewingCount = this.responseDate.body.interview_count;
          this.unansweredCount = this.responseDate.body.unanswer_user;
          this.invite_sent = this.responseDate.body.invite_sent;
          this.isSaved = this.responseDate.body.is_saved;
          this.user_id = this.responseDate.body.user;
          this.getClientInfo();
          this.getQuestions();
          this.startTable();
          
          this.attachmentFile = this.responseDate.body.attachments !== '' ? true : false;
          if (this.responseDate.body.attachments != '') {
            const initialUploadedFile = this.responseDate.body.attachments.split(',');
            this.uploadedFileArr = initialUploadedFile;
            if (this.uploadedFileArr.length > 0) {

              this.uploadedFileArr.forEach(element => {
                this.apiService.getRequest(constant.apiurl + constant.fileupload + element)
                  .subscribe(resData => {
                    // this.initialAttachement.push(responseData['body']);
                    let edifiletype = resData['body']['file_ext'];
                    let ifiletype;
                    if (edifiletype === 'image/jpeg' || edifiletype == 'image/png' || edifiletype == 'image/jpg' || edifiletype == 'image/gif') {
                      ifiletype = 'img';
                      // fileItem['tempimage'] = this.DomSan.bypassSecurityTrustResourceUrl(url);
                    } else if (edifiletype === 'video/x-matroska' || edifiletype === 'video/mp4') {
                      ifiletype = 'video';
                    } else if (edifiletype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || edifiletype === 'application/msword') {
                      ifiletype = 'doc';
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
    if (this.loggedUser) {
      const check_url = constant.apiurl + constant.job_proposal + '?job=' + this.job_id + '&user=' + this.loggedUser;
      this.apiService.getRequest(check_url).subscribe(
        row => {
          this.resfindPropose = row;
          if (this.resfindPropose.body.count > 0) {
            this.findPropose = false;
          }
        });
    }
    this.siteConnect = localStorage.getItem('workplus_connect');
    
    this.usersService.availableConnects.subscribe(availableConnect => {
      this.userAvailableConnect = availableConnect;
      if (this.userAvailableConnect && this.siteConnect != "" && typeof this.siteConnect != 'undefined' && this.siteConnect != null && this.siteConnect != 'null') {
        if(parseInt(this.userAvailableConnect) >= parseInt(this.siteConnect)){
          this.checkConnects = false;
        }else{
          this.checkConnects = true;
        }
      }
    });
  }
  postJobLikeThis() {
    this.router.navigate(['/reuse/' + this.job_id]);
    // this.router.navigate(['/search/job'], { queryParams: { payment: this.payment,'experience_level':this.hiredLevel, 'commitment': this.jobCommitment, 'expected_to_complete':this.expComp, 'category_id' : this.mainCategory, 'location' : this.selectedCountry}, queryParamsHandling: 'merge' });
  }
  skillBasedSearch(skill) {
    this.router.navigate(['/search/job'], { queryParams: { skill: skill }, queryParamsHandling: 'merge' });
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

  startTable() {
    if(this.paginator == null) return null;
    merge(this.initialTable.dataChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.initialTable!.getRepoApi(
            this.paginator.pageIndex, this.user_id, this.job_id);
        }),
        map(data => {
          this.isLoadingResults = false;
          this.resultsLength = data.count;
          this.showOtherJobs = this.resultsLength === 0 ? false : true;
          return data.results;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      ).subscribe(data => {
        this.dataSource.data = data;
      });
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

  refreshOpenTable() {
    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.initialTable!.getRepoApi(
            this.paginator.pageIndex, this.user_id, this.job_id);
        }),
        map(data => data),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      ).subscribe(data => {
        this.isLoadingResults = false;
        if (data['results'] != null && data['results'].length != 0) {
          this.resultsLength = data['count'];
          this.dataSource.data = data['results'];
          return this.dataSource;
        } else {
          if (this.paginator.hasPreviousPage()) {
            this.paginator.previousPage();
          }
        }
      });
  }

  
  getQuestions(){
    if (this.question_id != '') {
      const selectedQuestionArray = this.question_id.split(',');
      if (selectedQuestionArray.length > 0) {
        selectedQuestionArray.forEach(element => {
          this.apiService.getRequest(constant.apiurl + constant.jobQuestions + element)
          .subscribe(responseData => {
            const quesData = responseData['body'];
            this.questions.push({'question_id':quesData.id , 'question': quesData.question});
            this.showQuestion = true;
          });
        });
      }
    }
  }
    checkInvitedJob(){
      this.apiService.getRequest(constant.apiurl + constant.getinvitelist +'?freelancer='+ this.loggedUser + '&job='+ this.job_id).subscribe(
        data => {
          if (data['status'] === 200 && data['ok'] === true) {
            if (data['body'].count > 0) {
              if (data['body'].results[0].status == 'Accept'){
                this.isInvited = false;
              } else if (data['body'].results[0].status == 'Cancel'){
                this.isInvited = false;
              } else {
                this.isInvited = true;
              }
              this.interview_id = data['body'].results[0].id;
            }
          }
        }, err => {
          console.log(err);
        });
    }
  getClientInfo() {
    this.apiService.getRequest(constant.apiurl + constant.get_user_details + this.user_id + '/').subscribe(
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
  displayCopyColor() {
    this.displayColor = '#ae2838';
  }
  /** Update wish list - saved job */
  updateWishlist(jobID) {
    const params = {
      'user': this.loggedUser,
      'job': jobID
    };
    this.apiService.putRequest(constant.apiurl + constant.updateWishlist, params).subscribe(
      data => { //success
        this.responseSavePost = data;
        if (this.responseSavePost.id != '') {
          let msg = '';
          if (this.responseSavePost.iswishlist) {
            this.isSaved = true;
            msg = 'Job post is saved';
          }
          else {
            this.isSaved = false;
            msg = 'Saved job deleted successfully';
          }
          this.usersService.snackMessage(msg);
        }
      }, err => { //error
        this.responseSavePost = err;
        if (this.responseSavePost.error.non_field_errors[0] == 'Wishlist Duplicated') {
          this.usersService.snackMessage('Job already saved');
        } else {
          this.usersService.snackErrorMessage('Something went wrong. Try again');
        }
        console.log(err);
      });
  }
}

/* Post Table Display - Start */
export interface responseApi {
  results: responseData[];
  count: number;
}

export interface responseData {
  id: number;
  name: string;
  payment: string;
  status: string;
}

export class InitialTable {
  username: string = this.apiService.decodejwts().userid;
  constructor(private http: HttpClient, private apiService: ApiService) { }
  dataChange: BehaviorSubject<responseData[]> = new BehaviorSubject<responseData[]>([]);
  public get authHeader(): string {
    return `JWT ${localStorage.getItem('exp_token')}`;
  }
  setHeaders() {
    return {
      headers: new HttpHeaders().set('Authorization', this.authHeader)
    };
  }
  getRepoApi(page: number, user: string, job: string): Observable<responseApi> {
    const href = constant.apiurl + constant.getalljobdetails;
    const requestUrl = `${href}/?exclude_job=${job}&user=${user}&page=${page + 1}&status=Open&omit=invited`;
    return this.http.get<responseApi>(requestUrl, this.setHeaders());
  }
}
/* Post Table Display - End */
