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
  MatIcon,
  MatExpansionModule
} from '@angular/material';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { merge } from 'rxjs/observable/merge';
import { of as observableOf } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';
import { startWith } from 'rxjs/operators/startWith';
import { switchMap } from 'rxjs/operators/switchMap';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ApiService } from '../../../services/api/api.service';
import { constant, inputData } from '../../../../data/constant';
import { Title, Meta, DOCUMENT } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteconfirmComponent } from './../postjob/deleteconfirm/deleteconfirm.component';
import { FormBuilder, FormGroup, FormControl , Validators } from '@angular/forms';
// import { SearcheditdialogComponent } from './searcheditdialog/searcheditdialog.component';
import { UserService } from '../../../services/sync/user.service';
import { country } from '../../../../data/country';

@Component({
  selector: 'app-jobsaved',
  templateUrl: './jobsaved.component.html',
  styleUrls: ['./jobsaved.component.css'],
  providers: [NgbRatingConfig] // add NgbRatingConfig to the component providers
})
export class JobsavedComponent implements AfterViewInit {
  searchOpenCheck = false;
  searchFormOpen = '';

   user_ID: string = this.apiService.decodejwts().userid;
   displayedColumns = ['jobtitle'];
   customFilter: string;
   initialTable: InitialTable | null;
   dataSource = new MatTableDataSource(this.dataSource);
   resultsLength = 0;
   isLoadingResults = false;
   deleteOpenRes: any;
   isExpanded = false;
   dataPaginatorhidder:boolean;
   @ViewChild('dataPaginator') paginator: MatPaginator;
   @ViewChild(MatSort) sort: MatSort;
   @ViewChild('filter') filter: ElementRef;
   @ViewChild('minbuget') minbuget: ElementRef;
   @ViewChild('maxbuget') maxbuget: ElementRef;
   // Advance Search
   @ViewChild('skillFilter') skillFilter: ElementRef;
   @ViewChild('nameFilter') nameFilter: ElementRef;
   @ViewChild('allwordsfilter') allwordsfilter: ElementRef;
   @ViewChild('exactphrasefilter') exactphrasefilter: ElementRef;
   @ViewChild('excludewordfilter') excludewordfilter: ElementRef;

   countries: any = country.list;
   search;
   categorylists: any; initialsearch: any;
   commitsArr: any = [];
   jobtypeQuery = '';
   expLevelQuery = '';
   expCompQuery = '';
   commitQuery = '';
   categoryID;
   categoryQuery = '';
   budgetQuery = '';
   responseSavePost: any;
 
   // search variable
   expLevelArray: any = [];
   jobTypeArray: any = [];
   expCompArray: any = [];
   location: any = [];
   categoryArr: any = [];
   searchHistory: any = [];
   pre_expLevel: any = [];
   pre_jobtype: any = [];
   pre_project_langth: any = [];
   pre_hours_per_week: any = [];
   pre_budget: any = [];

   searchSaveArr: any = [];
   responseSearchData: any = [];
 
   searchDisplayForm: FormGroup;
 
   otherBudgetSelect = false;
   allwordSearch = '';
   exactSearch = '';
   excludeSearch = '';
   nameSearch = '';
   skillSearch = '';
 
   paylists = [
     { 'key': 'Hourly', 'name': 'Pay by the hour' },
     { 'key': 'Fixed', 'name': 'Pay a fixed price' }
   ];
   exp_levels = [
     { 'key': 'Entry', 'name': 'Entry Level' },
     { 'key': 'Intermediate', 'name': 'Intermediate' },
     { 'key': 'Expert', 'name': 'Expert' }
   ];
   exp_comps = [
     { 'key': '>6', 'name': 'More than 6 months' },
     { 'key': '3-6', 'name': '3 to 6 months' },
     { 'key': '1-3', 'name': '1 to 3 months' },
     { 'key': '<6', 'name': 'less than 1 month' },
     { 'key': '<1', 'name': 'less than 1 week' }
   ];
   commits = [
     { 'key': '>30', 'name': 'More than 30 hrs/week' },
     { 'key': '<30', 'name': 'Less than 30 hrs/week' }
   ];
   budgetTypes = [
    { 'key': 0, 'option': '<100', 'name': 'Less than Rs.1000' },
    { 'key': 5000, 'option': '1000-5000', 'name': 'Rs.1000 - Rs.5000' },
    { 'key': 10000, 'option': '5000-10k', 'name': 'Rs.5000 - Rs.10,000' },
    { 'key': 50000, 'option': '10k-50k', 'name': 'Rs.10,000 - Rs.50,000' },
    { 'key': 50001, 'option': '>50k', 'name': 'Rs.50,000 +' }
  ];
   budgetArr: any = []; getSearchVal: any = [];
   minBudget;
   maxBudget;

  commitsDef = [
    { 'key': '>30', 'name': '> 30 hrs/week' },
    { 'key': '<30', 'name': '< 30 hrs/week' },
    { 'key': 'none', 'name': 'I don`t know yet' }
  ];
  complements = [
    { 'key': '>6', 'name': '> 6 months' },
    { 'key': '3-6', 'name': '3 to 6 months' },
    { 'key': '1-3', 'name': '1 to 3 months' },
    { 'key': '<6', 'name': '< 1 month' },
    { 'key': '<1', 'name': '< 1 week' }
  ];
  hiredLevelTxt = { 'Entry' : '☆',
    'Intermediate': '☆☆',
    'Expert': '☆☆☆'
  };
  proposalFormat = inputData.proposalFormat;
  userLogged = false; user_id = '';
  showBtn = -1; textLength = 150;



   constructor(
     private http: HttpClient,
     private cdRef: ChangeDetectorRef,
     public dialog: MatDialog,
     public snackBar: MatSnackBar,
     private apiService: ApiService,
     @Inject(DOCUMENT) private document: HTMLDocument,
     private titleService: Title,
     private router: Router,
     private route: ActivatedRoute,
     private fb: FormBuilder,
     private ratingConfig: NgbRatingConfig,
     private userservice: UserService
   ) {
      // customize default values of ratings used by this component tree
      ratingConfig.max = inputData.maximumRatingConfig;
      ratingConfig.readonly = true;
      this.searchDisplayForm = fb.group({
       'search_category' : null,
       'search_location' : null
       });
   }

   ngAfterViewInit() {
     this.initialTable = new InitialTable(this.http, this.apiService);
     this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 1);
     this.startTable();

     this.cdRef.detectChanges();
   }

   panelExpand(expanded) {
     this.isExpanded = expanded === false ? true : false;
   }

   showUndoBtn(index, textMoreLess) {
    if (textMoreLess === 'less') {
      this.showBtn = index;
    } else {
      this.showBtn = -1;
    }
  }

   ngOnInit() {
     if (this.apiService.decodejwts().userid != null) {
       this.userLogged = true;
       this.user_id = this.apiService.decodejwts().userid;
     }
     this.getCategoryList();
     this.getSearchHistory();
     this.getSavedJobCount();
   }

   getSavedJobCount() {
     console.log();
    this.apiService.getRequest(constant.apiurl + constant.savewishlist + '?user=' + this.user_ID)
    .subscribe(response => {
      console.log(response);
    },
    err => {
      console.log(err);
    });
   }

   advanceSearch() {
    this.searchSaveArr['all_words'] = this.allwordSearch = this.allwordsfilter.nativeElement.value;
    this.searchSaveArr['exact_phrase'] = this.exactSearch = this.exactphrasefilter.nativeElement.value;
    this.searchSaveArr['exclude_word'] = this.excludeSearch = this.excludewordfilter.nativeElement.value;
    this.searchSaveArr['name'] = this.nameSearch = this.nameFilter.nativeElement.value;
    this.searchSaveArr['skills'] = this.skillSearch = this.skillFilter.nativeElement.value;
    this.refreshOpenTable(this.filter.nativeElement.value);
   }

  onDeleteJobPost(job_id) {
    this.apiService.deleteRequest(constant.apiurl + constant.savewishlist + job_id + '/', '')
       .subscribe(response => {
        this.userservice.snackMessage('Saved job deleted successfully');
        this.refreshOpenTable(this.filter.nativeElement.value);
       });
  }

   // onOtherBudget(check) {
   //   if (check == true)  {
   //     console.log('hi');
   //     this.budgetArr = [];
   //   }
   // }

   getCategoryList() {
     this.apiService.getRequest(constant.apiurl + constant.job_category_all + '?search=')
       .subscribe(response => {
         this.categorylists = response['body'];
       });
   }

   getSearchHistory() {
     this.apiService.getRequest(constant.apiurl + constant.job_search_save + '?user=' + this.user_ID)
       .subscribe(response => {
         console.log(response);
         this.responseSearchData = response;
         if (this.responseSearchData.body.length > 0) {
           this.searchHistory = this.responseSearchData.body;
         }
         console.log(this.searchHistory);
       });
   }

   onChangeJobType(val: String, e) {
     if (e) {
       this.jobTypeArray.push(val);
     } else {
       const value = this.jobTypeArray.find(x => x == val);
       const index = this.jobTypeArray.indexOf(value);
       this.jobTypeArray.splice(index, 1);
     }
     this.searchSaveArr['job_type'] = this.jobTypeArray;
     this.jobtypeQuery = this.jobTypeArray.toString();
     this.refreshOpenTable(this.filter.nativeElement.value);
     return false;
   }

   onChangeExpLevel(val: string, e) {
     if (e) {
       this.expLevelArray.push(val);
     } else {
       const value = this.expLevelArray.find(x => x == val);
       const index = this.expLevelArray.indexOf(value);
       this.expLevelArray.splice(index, 1);
     }
     this.searchSaveArr['experience_level'] = this.expLevelArray;
     this.expLevelQuery = this.expLevelArray.toString();
     this.refreshOpenTable(this.filter.nativeElement.value);
     return false;
   }

   onChangeExpComp(val: string, e) {
     if (e) {
       this.expCompArray.push(val);
     } else {
       const value = this.expCompArray.find(x => x == val);
       const index = this.expCompArray.indexOf(value);
       this.expCompArray.splice(index, 1);
     }
     this.searchSaveArr['project_length'] = this.expCompArray;
     this.expCompQuery = this.expCompArray.toString();
     this.refreshOpenTable(this.filter.nativeElement.value);
     return false;
   }

   onChangeCommits(val: string, e) {
     if (e) {
       this.commitsArr.push(val);
     } else {
       const value = this.commitsArr.find(x => x == val);
       const index = this.commitsArr.indexOf(value);
       this.commitsArr.splice(index, 1);
     }
     this.searchSaveArr['hours_per_week'] = this.commitsArr;
     this.commitQuery = this.commitsArr.toString();
     this.refreshOpenTable(this.filter.nativeElement.value);
   }

   onSelectedCountry(countryValue) {
     console.log(countryValue);
     this.searchSaveArr.location = '';
     this.location = countryValue;
     this.searchSaveArr['location'] = countryValue;
     this.refreshOpenTable(this.filter.nativeElement.value);
     return false;
   }

   onSelectedSearch(searchId, searchData) {
     this.filter.nativeElement.value = searchData.job_search;
     this.jobtypeQuery = searchData.job_type.toString();
     this.expLevelQuery = searchData.experience_level.toString();
     this.expCompQuery = searchData.project_length.toString();
     this.commitQuery = searchData.hours_per_week.toString();
     this.categoryQuery = searchData.category.toString();
     this.location = searchData.location.toString();
     this.expLevelArray = this.pre_expLevel = searchData.experience_level;
     this.jobTypeArray = this.pre_jobtype = searchData.job_type;
     this.expCompArray = this.pre_project_langth = searchData.project_length;
     this.commitsArr = this.pre_hours_per_week = searchData.hours_per_week;
     this.budgetArr = this.pre_budget = searchData.budget;
     if (this.pre_budget.length > 0) {
       this.minBudget = this.pre_budget[0];
       this.maxBudget = this.pre_budget[this.pre_budget.length - 1];
     } else {
       this.minBudget = '';
       this.maxBudget = '';
     }

     this.searchDisplayForm.patchValue({
       'search_category' : searchData.category,
       'search_location' : searchData.location
     });
    this.allwordSearch = this.allwordsfilter.nativeElement.value = searchData.all_words;
    this.exactSearch = this.exactphrasefilter.nativeElement.value = searchData.exact_phrase;
    this.excludeSearch = this.excludewordfilter.nativeElement.value = searchData.exclude_word;
    this.nameSearch = this.nameFilter.nativeElement.value = searchData.name;
    this.skillSearch = this.skillFilter.nativeElement.value = searchData.skills;
     this.refreshOpenTable(this.filter.nativeElement.value);
   }

   onSearchClear() {
     this.filter.nativeElement.value = '';
     this.jobtypeQuery = '';
     this.expLevelQuery = '';
     this.expCompQuery = '';
     this.commitQuery = '';
     this.categoryQuery = '';
     this.location = '';
     this.minBudget = '';
     this.maxBudget = '';
     this.expLevelArray = [];
     this.jobTypeArray = [];
     this.expCompArray = [];
     this.commitsArr = [];
     this.budgetArr = [];
     this.pre_expLevel = [];
     this.pre_jobtype = [];
     this.pre_project_langth = [];
     this.pre_hours_per_week = [];
     this.pre_budget = [];
     this.dataSource.filter = '';
     this.nameSearch = '';
     this.skillSearch = '';
     this.nameFilter.nativeElement.value = '';
     this.skillFilter.nativeElement.value = '';
     this.allwordsfilter.nativeElement.value = '';
     this.exactphrasefilter.nativeElement.value = '';
     this.excludewordfilter.nativeElement.value = '';
     this.searchDisplayForm.patchValue({
       'search_category' : [],
       'search_location' : []
     });
     this.refreshOpenTable(this.filter.nativeElement.value);
   }

   onDeleteHistory(searchId) {
     const dialogDeleteConfirm = this.dialog.open(DeleteconfirmComponent, {
       disableClose: true,
       data: {}
     });
     dialogDeleteConfirm.afterClosed().subscribe(result => {
       if (result === 'confirm') {
         const URL = constant.apiurl + constant.job_search_save + searchId + '/';
         this.apiService.deleteRequest(URL, '').subscribe(response => {
           this.deleteOpenRes = response;
           if (this.deleteOpenRes.status === 204) {
            this.userservice.snackMessage('Saved Search Deleted Successfully');
             this.getSearchHistory();
           }
         });
       }
     });
   }
 
   onChangeBudget(val: string, e) {
     this.minBudget = '';
     this.maxBudget = '';
     if (e) {
       this.budgetArr.push(val);
     } else {
       const value = this.budgetArr.find(x => x == val);
       const index = this.budgetArr.indexOf(value);
       this.budgetArr.splice(index, 1);
     }
     if (this.budgetArr.length === 1) {
       switch (this.budgetArr.toString()) {
         case '0':
           this.minBudget = 0;
           this.maxBudget = 100;
         break;
         case '500':
           this.minBudget = 101;
           this.maxBudget = 500;
         break;
         case '1000':
           this.minBudget = 501;
           this.maxBudget = 1000;
         break;
         case '5000':
           this.minBudget = 1001;
           this.maxBudget = 5000;
         break;
         case '5001':
           this.minBudget = 5001;
           this.maxBudget = '';
         break;
       }
     } else if (this.budgetArr == []) {
       this.minBudget = '';
       this.maxBudget = '';
     } else if (this.budgetArr.length >= 2) {
       const sortBudget = this.budgetArr.sort((a, b) => 0 - (a > b ? -1 : 1));
       this.minBudget = sortBudget[0];
       this.maxBudget = sortBudget[sortBudget.length - 1];
       if (sortBudget[sortBudget.length - 1] == 5001) {
         this.maxBudget = '';
       }
     }
     this.searchSaveArr['budget'] = this.budgetArr;
     this.budgetQuery = this.budgetArr.toString();
     this.refreshOpenTable(this.filter.nativeElement.value);
   }
 
   // Initial category list display & filter option
   filtercategorylists(search = '') {
     if (typeof search === 'object') {
       this.initialsearch = search;
       search = this.initialsearch.name;
     }
     this.apiService.getRequest(constant.apiurl + constant.job_category_all + '?search=' + search)
       .subscribe(response => {
         this.categorylists = response['body'];
       });
   }
 
   onCategorySelect(val) {
     console.log(val);
     this.searchSaveArr.category = '';
     this.categoryArr = val;
     this.searchSaveArr['category'] = val;
     this.categoryQuery = this.categoryArr.toString();
     this.refreshOpenTable(this.filter.nativeElement.value);
     return false;
   }
 
   callAfterSearch(search = '') {
     if (typeof search === 'object') {
       this.getSearchVal = search;
       this.categoryID = this.getSearchVal.id;
       console.log(this.categoryID);
       this.searchSaveArr['category'] = this.categoryID;
       this.refreshOpenTable(this.filter.nativeElement.value);
     }
   }
 
   redirectJob(jobID) {
     this.router.navigate(['/jobdetail/', jobID]);
   }
 
   // display the name of category in the input field
   displayname(category) {
     if (category != null) {
       this.initialsearch = category.name;
       console.log(category.id);
       return category.name;
     }
   }
 
   startTable() {
     merge(this.initialTable.dataChange, this.paginator.page)
       .pipe(
       startWith({}),
       switchMap(() => {
         this.isLoadingResults = true;
         this.dataSource.filter = this.filter.nativeElement.value;
         return this.initialTable!.getRepoApi(
           this.paginator.pageIndex,
           this.dataSource.filter,
           this.jobtypeQuery,
           this.expLevelQuery,
           this.expCompQuery,
           this.commitQuery,
           this.location,
           this.minBudget,
           this.maxBudget,
           this.categoryQuery,
           this.nameSearch,
           this.skillSearch,
           this.allwordSearch,
            this.exactSearch,
            this.excludeSearch
          );
       }),
       map(data => {
         this.isLoadingResults = false;
         this.resultsLength = data.count;
         if(this.resultsLength > 10){
          this.dataPaginatorhidder = true;
        }else{
          this.dataPaginatorhidder = false;
        }
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
 
   searchMinMaxBudget() {
     this.minBudget = this.minbuget.nativeElement.value;
     this.maxBudget = this.maxbuget.nativeElement.value;
     this.refreshOpenTable(this.filter.nativeElement.value);
   }
 
   isMinFloat(event) {
     if (event.which < 46 || event.which > 59) {
         event.preventDefault();
     } // prevent if not number/dot
     if (event.which == 46 && event.target.value.indexOf('.') != -1) {
         event.preventDefault();
     }
     const twoDigit = parseFloat(this.minbuget.nativeElement.value);
     const findLength = twoDigit.toString().split('.')[1];
     if (findLength != '' && findLength.length > 1 ) {
       this.minbuget.nativeElement.value = twoDigit.toFixed(1);
     }
   }
 
   isMaxFloat(event) {
     if (event.which < 46 || event.which > 59) {
         event.preventDefault();
     } // prevent if not number/dot
     if (event.which == 46 && event.target.value.indexOf('.') != -1) {
         event.preventDefault();
     }
     const twoDigit = parseFloat(this.maxbuget.nativeElement.value);
     const findLength = twoDigit.toString().split('.')[1];
     if (findLength != '' && findLength.length > 1 ) {
       this.maxbuget.nativeElement.value = twoDigit.toFixed(1);
     }
   }
 
   applyFilter(filterValue: string) {
     console.log('hi');
     filterValue = this.filter.nativeElement.value;
     filterValue = filterValue.toLowerCase();
     this.dataSource.filter = filterValue;
     this.paginator.pageIndex = 0;
     this.refreshOpenTable(filterValue);
   }
 
   // refresh Open table
   refreshOpenTable(filterValue) {
     merge()
     .pipe(
       startWith({}),
       switchMap(() => {
         this.isLoadingResults = true;
         return this.initialTable!.getRepoApi(
           this.paginator.pageIndex,
           this.dataSource.filter,
           this.jobtypeQuery,
           this.expLevelQuery,
           this.expCompQuery,
           this.commitQuery,
           this.location,
           this.minBudget,
           this.maxBudget,
           this.categoryQuery,
           this.nameSearch,
           this.skillSearch,
           this.allwordSearch,
          this.exactSearch,
          this.excludeSearch
         );
       }),
       map(data => data),
       catchError(() => {
         this.isLoadingResults = false;
         return observableOf([]);
       })
       ).subscribe(data => {

         this.isLoadingResults = false;
         this.resultsLength = data['count'];
         if(this.resultsLength > 10){
          this.dataPaginatorhidder = true;
          }else{
            this.dataPaginatorhidder = false;
          }
         this.dataSource.data = data['results'];
         if (data['results'] != null && data['results'].length !== 0) {
           this.resultsLength = data['count'];

           this.dataSource.data = data['results'];
           return data['results'];
         } else {
           if (this.paginator.hasPreviousPage()) {
             this.paginator.previousPage();
           }
         }
       }
       );
     }
 
     saveSearch() {
       console.log(this.searchSaveArr);
       const jobfilter = this.filter.nativeElement.value;
       if ( jobfilter !== '' && jobfilter != null ) {
         const filterSave = {
           'user' : this.user_ID,
           'job_search': jobfilter,
           'experience_level': this.searchSaveArr['experience_level'],
           'job_type': this.searchSaveArr['job_type'],
           'budget': this.searchSaveArr['budget'],
           'project_length': this.searchSaveArr['project_length'],
           'hours_per_week': this.searchSaveArr['hours_per_week'],
           'category': this.searchSaveArr['category'],
           'location': this.searchSaveArr['location'],
           'all_words': this.searchSaveArr['all_words'],
           'exact_phrase': this.searchSaveArr['exact_phrase'],
           'exclude_word': this.searchSaveArr['exclude_word'],
           'skills': this.searchSaveArr['skills'],
           'name': this.searchSaveArr['name']
         };
         this.apiService.postRequest(constant.apiurl + constant.job_search_save, filterSave ).subscribe(
           data => {
             console.log(data);
             this.responseSearchData = data;
             if (this.responseSearchData.id != '') {
               this.getSearchHistory();
               this.userservice.snackMessage('Saved Search History');
             }
           }, err => {
             console.log(err);
           });
       }
    }

    saveUserPost(jobID) {
      const params = {
        'user' : this.user_id,
        'job': jobID
      };
      this.apiService.postRequest(constant.apiurl + constant.savewishlist, params ).subscribe(
        data => {
          console.log(data);
          this.responseSavePost = data;
          if (this.responseSavePost.id != '') {
            this.userservice.snackMessage('Job post is saved');
          }
        }, err => {
          console.log(err);
        });
    }

    notInterestSave() {
      console.log('hiii');
    }
    skillBasedSearch(skill){
      this.router.navigate(['/search/job'], { queryParams: { skill: skill }, queryParamsHandling: 'merge' });
    }
 }
 
 export interface responseApi {
   results: responseData[];
   count: number;
 }
 
 export interface responseData {
   id: number;
   name: string;
   payment: string;
   description: string;
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
   getRepoApi(page: number, filter = '', jobtype = '', experience_level = '', exp_comp = '', commit = '', location = '', min = '' , max ='',category = '', name = '', skills = '', allwordSearch = '', exactSearch = '', excludeSearch = ''): Observable<responseApi> {
     filter = filter === '' ? '' : filter;
     const href = constant.apiurl + constant.savewishlist;
     const requestUrl = `${href}?user=${this.username}&search=${filter}&page=${page + 1}`;
     return this.http.get<responseApi>(requestUrl, this.setHeaders());
   }
 }
 