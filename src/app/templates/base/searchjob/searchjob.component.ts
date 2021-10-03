/**
 * Page : Search Job
 * Use : User can search job details based on differet filter
 * Page Functionality :
 * >>> Create the material Table
 * >>> Added the job filter option ( advanced search, category & location )
 * >>> User can display the specific job details
 * Created Date : 04/07/2018
 * Modified Date : 28/07/2018
 * Copyright : bsetec
 */
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
  MatExpansionModule,
  PageEvent
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
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { SearcheditdialogComponent } from './searcheditdialog/searcheditdialog.component';
import { UserService } from '../../../services/sync/user.service';

import { country } from '../../../../data/country';

@Component({
  selector: 'app-searchjob',
  templateUrl: './searchjob.component.html',
  styleUrls: ['./searchjob.component.css'],
  providers: [NgbRatingConfig] // add NgbRatingConfig to the component providers
})
export class SearchjobComponent implements AfterViewInit {
  searchOpenCheck = false;
  searchFormOpen = '';

  user_ID: string = this.apiService.decodejwts().userid; // logged user id
  displayedColumns = ['jobtitle'];
  customFilter: string;
  initialTable: InitialTable | null;
  dataSource = new MatTableDataSource(this.dataSource);
  resultsLength = 0;
  isLoadingResults = false;
  deleteOpenRes: any;
  isExpanded = false;
  @ViewChild('dataPaginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filterdata') filterdata: ElementRef;
  @ViewChild('minbuget') minbuget: ElementRef;
  @ViewChild('maxbuget') maxbuget: ElementRef;
  // Declare the Advanced search filter variable here.
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
  locationQuery: any = '';
  categoryID;
  categoryQuery = '';
  budgetQuery = '';
  responseSavePost: any;
  pageEvent: PageEvent;

  // Decalre the search variable here.
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
  pre_category: any = [];
  pre_location: any = [];
  searchSaveArr: any = [];
  responseSearchData: any = [];

  searchDisplayForm: FormGroup;
  // Decalre the Advanced search variable here.
  otherBudgetSelect = false;
  allwordSearch: any = '';
  exactSearch: any = '';
  excludeSearch: any = '';
  nameSearch: any = '';
  skillSearch: any = '';
  // Assigned the defined variable for data prepopulation & search functionality
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
  hiredLevelTxt = {
    'Entry': '☆',
    'Intermediate': '☆☆',
    'Expert': '☆☆☆'
  };
  proposalFormat = inputData.proposalFormat;
  userLogged = false; user_id = '';
  userType: string;
  countSavedJob = 0;
  savedErrorRes: any = [];
  // Variable's for description more/less display option
  textLength = 150;
  morelessText = 'More';
  isOpen = true;
  showBtn = -1;
  Paginatorhidder:boolean;
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
    private _host: ElementRef,
    private ratingConfig: NgbRatingConfig,
    private userservice: UserService
  ) {
      // customize default values of ratings used by this component tree
      ratingConfig.max = inputData.maximumRatingConfig;
      ratingConfig.readonly = true;
    // Created the search form for job search fuctionality
    this.searchDisplayForm = fb.group({
      'search_category': null,
      'search_location': null,
      'jobsearchfilter': null,
      'allwordsfilter': null,
      'exactphrasefilter': null,
      'excludewordfilter': null,
      'nameFilter': null,
      'skillFilter': null
    });
  }

  ngAfterViewInit() {
    this.route.queryParams.subscribe(params => {
      if (params.page != '' && typeof params.page != 'undefined') {
        this.paginator.pageIndex = params.page;
      }
      if (params.search != '' && typeof params.search != 'undefined') {
        this.dataSource.filter = params.search;
      }
      if (params.payment != '' && typeof params.payment != 'undefined') {
        this.jobtypeQuery = params.payment;
        this.jobTypeArray = this.pre_jobtype = this.jobtypeQuery.toString().split(',');
      }
      if (params.experience_level != '' && typeof params.experience_level != 'undefined') {
        this.expLevelQuery = params.experience_level;
        this.expLevelArray = this.pre_expLevel = this.expLevelQuery.toString().split(',');
      }
      if (params.commitment != '' && typeof params.commitment != 'undefined') {
        this.commitQuery = params.commitment;
        this.commitsArr = this.pre_hours_per_week = this.commitQuery.toString().split(',');
      }
      if (params.expected_to_complete != '' && typeof params.expected_to_complete != 'undefined') {
        this.expCompQuery = params.expected_to_complete;
        this.expCompArray = this.pre_project_langth = this.expCompQuery.toString().split(',');
      }
      if (params.category_id != '' && typeof params.category_id != 'undefined') {
        this.categoryQuery = params.category_id;
        this.categoryArr = this.pre_category = this.categoryQuery.toString().split(',');
      }
      if (params.location != '' && typeof params.location != 'undefined') {
        this.locationQuery = params.location;
        this.location = this.pre_location = this.locationQuery.toString().split(',');
      }
      if (params.minValue != '' && typeof params.minValue != 'undefined') {
        this.minBudget = params.minValue;

      }
      if (params.maxValue != '' && typeof params.maxValue != 'undefined') {
        this.maxBudget = params.maxValue;
        if (params.budget != '' && typeof params.budget != 'undefined') {
          this.budgetQuery = params.budget;
          this.pre_budget = this.budgetQuery.toString().split(',');
          this.budgetArr =  this.pre_budget = this.pre_budget.map(Number);
        }
      }
      if (params.skill != '' && typeof params.skill != 'undefined') {
        this.skillSearch = params.skill;
      }
    });
    
    this.filterdata.nativeElement.value = localStorage.getItem('search_by');
    localStorage.removeItem('search_by');
    this.initialTable = new InitialTable(this.http, this.apiService);
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 1);
    // if(this.userLogged == true){
      this.startTable();
    // }

    this.cdRef.detectChanges();
  }

  /** Function is used for more/less content expand & reduce */
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
      this.userType = this.apiService.decodejwts().user_type;
      this.user_id = this.apiService.decodejwts().userid;
    }
    this.getCategoryList();
    this.getSearchHistory();
    this.findSavedJobCount();
    this.filtercategorylists();
  }

  getClickElement(jobDescId) {
    console.log(jobDescId);
  }
  /** Function is used for less/more text display */
  onMoreToggle(textlength, findText) {
    if (findText === 'More') {
      this.morelessText = 'Less';
    } else {
      this.morelessText = 'More';
    }
  }
  /** function is used for saved job data's count */
  findSavedJobCount() {
    this.apiService.getRequest(constant.apiurl + constant.savewishlist + '?user=' + this.user_ID)
      .subscribe(response => {
        this.countSavedJob = response['body']['count'];
      },
        err => {
          this.countSavedJob = 0;
        });
  }
  /** Function directly call from advanced search form */
  advanceSearch() {
    this.searchSaveArr['all_words'] = this.allwordSearch = this.allwordsfilter.nativeElement.value;
    this.searchSaveArr['exact_phrase'] = this.exactSearch = this.exactphrasefilter.nativeElement.value;
    this.searchSaveArr['exclude_word'] = this.excludeSearch = this.excludewordfilter.nativeElement.value;
    this.searchSaveArr['name'] = this.nameSearch = this.nameFilter.nativeElement.value;
    this.searchSaveArr['skills'] = this.skillSearch = this.skillFilter.nativeElement.value;
    this.refreshOpenTable(this.filterdata.nativeElement.value);
  }
  /** Advanced search form hide/show we used this function */
  onSearchToggleButton(toggleValue) {
    this.searchOpenCheck = toggleValue == false ? true : false;
    this.searchFormOpen = this.searchOpenCheck == true ? 'search_toggle' : '';
  }

  // onOtherBudget(check) {
  //   if (check == true)  {
  //     console.log('hi');
  //     this.budgetArr = [];
  //   }
  // }
  /** Function will get the all job category list and display to search filter option */
  getCategoryList() {
    this.apiService.getRequest(constant.apiurl + constant.job_category_all + '?search=')
      .subscribe(response => {
        this.categorylists = response['body'];
      });
  }
  /** Get the saved search histroy from API */
  getSearchHistory() {
    this.apiService.getRequest(constant.apiurl + constant.job_search_save + '?user=' + this.user_ID)
      .subscribe(response => {
        this.responseSearchData = response;
        if (this.responseSearchData.body.count > 0) {
          this.searchHistory = this.responseSearchData.body.results;
        } else {
          this.searchHistory = [];
        }
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
    this.filterJob();
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
    this.filterJob();
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
    this.filterJob();
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
    this.filterJob();
  }
  onChangeLocation(val: string, e) {
    if (e) {
      this.location.push(val);
    } else {
      const value = this.location.find(x => x == val);
      const index = this.location.indexOf(value);
      this.location.splice(index, 1);
    }
    this.searchSaveArr['location'] = this.location;
    this.locationQuery = this.location.toString();
    this.filterJob();
  }

  onSelectedCountry(countryValue) {
    this.searchSaveArr.location = '';
    this.location = countryValue;
    this.searchSaveArr['location'] = countryValue;
    this.filterJob();
  }

  onSelectedSearch(searchId, searchData) {
    this.filterdata.nativeElement.value = searchData.job_search;
    this.jobtypeQuery = searchData.job_type.toString();
    this.expLevelQuery = searchData.experience_level.toString();
    this.expCompQuery = searchData.project_length.toString();
    this.commitQuery = searchData.hours_per_week.toString();
    this.categoryQuery = searchData.category.toString();
    this.locationQuery = searchData.location.toString();
    this.categoryArr = this.pre_category = searchData.category;
    this.location = this.pre_location = searchData.location;
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

    this.allwordSearch = this.allwordsfilter.nativeElement.value = (searchData.all_words != null) ? searchData.all_words : "";
    this.exactSearch = this.exactphrasefilter.nativeElement.value = (searchData.exact_phrase != null) ? searchData.exact_phrase : "";
    this.excludeSearch = this.excludewordfilter.nativeElement.value = (searchData.exclude_word != null) ? searchData.exclude_word : "";
    this.nameSearch = this.nameFilter.nativeElement.value = (searchData.name) ? searchData.name : "";
    this.skillSearch = this.skillFilter.nativeElement.value = (searchData.skills) ? searchData.skills : "";
    this.refreshOpenTable(this.filterdata.nativeElement.value);
  }
  /** Function is used for rename the search history text */
  onEditSearch(searchId, searchText) {
    const dialogEditSearch = this.dialog.open(SearcheditdialogComponent, {
      disableClose: true,
      data: { 'user_id': this.user_ID, 'search_text': searchText, 'url': constant.apiurl + constant.job_search_save + searchId + '/' }
    });
    dialogEditSearch.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.userservice.snackMessage('Saved Search updated');
        this.getSearchHistory();
      }
    });
  }
  /** Reset the search history value and display the all job details */
  onSearchClear() {
    this.filterdata.nativeElement.value = '';
    this.jobtypeQuery = '';
    this.expLevelQuery = '';
    this.expCompQuery = '';
    this.commitQuery = '';
    this.categoryQuery = '';
    this.locationQuery = '';
    this.minBudget = '';
    this.maxBudget = '';
    this.location = [];
    this.expLevelArray = [];
    this.jobTypeArray = [];
    this.expCompArray = [];
    this.commitsArr = [];
    this.budgetArr = [];
    this.pre_location = [];
    this.pre_category = [];
    this.pre_expLevel = [];
    this.pre_jobtype = [];
    this.pre_project_langth = [];
    this.pre_hours_per_week = [];
    this.pre_budget = [];
    this.dataSource.filter = '';
    this.nameSearch = '';
    this.skillSearch = '';
    this.allwordSearch = '';
    this.exactSearch = '';
    this.excludeSearch = '';
    this.nameFilter.nativeElement.value = '';
    this.skillFilter.nativeElement.value = '';
    this.allwordsfilter.nativeElement.value = '';
    this.exactphrasefilter.nativeElement.value = '';
    this.excludewordfilter.nativeElement.value = '';
    this.router.navigate(['/search/job']);
    //  this.refreshOpenTable(this.filterdata.nativeElement.value);
  }
  /** Delete the search history data's and reset the search hostory list's */
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
  budgetCalculation(){
    if (this.budgetArr.length === 1) {
      switch (this.budgetArr.toString()) {
        case '0':
          this.minBudget = 0;
          this.maxBudget = 1000;
          break;
        case '5000':
          this.minBudget = 1001;
          this.maxBudget = 5000;
          break;
        case '10000':
          this.minBudget = 5001;
          this.maxBudget = 10000;
          break;
        case '50000':
          this.minBudget = 10001;
          this.maxBudget = 50000;
          break;
        case '50001':
          this.minBudget = 50001;
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
  }

  onChangeBudget(val: string, option: string, e) {
    this.minBudget = '';
    this.maxBudget = '';
    if (e) {
      this.budgetArr.push(val);
    } else {
      const value = this.budgetArr.find(x => x == val);
      const index = this.budgetArr.indexOf(value);
      this.budgetArr.splice(index, 1);
    }
    this.budgetCalculation();
    this.searchSaveArr['budget'] = this.budgetArr;
    this.budgetQuery = this.budgetArr.toString();
    this.filterJob();
  }

  /** Initial category list display & filter option */
  filtercategorylists(search = '') {
    if (typeof search === 'object') {
      this.initialsearch = search;
      search = this.initialsearch.name;
    }
    this.apiService.getRequest(constant.apiurl + constant.job_category_all + '?search=' + search)
      .subscribe(response => {
        this.categorylists = response['body'];
      });
      if(this.userLogged == false){
        const href = constant.apiurl + constant.savejobdetails;
        this.http.get(href)
        .subscribe(data =>{
          this.isLoadingResults = false;
          this.resultsLength = data['count'];
          this.dataSource = data['results'];
        });
      }
  }

  onCategorySelect(val) {
    this.searchSaveArr.category = '';
    this.categoryArr = val;
    this.searchSaveArr['category'] = val;
    this.categoryQuery = this.categoryArr.toString();
    this.filterJob();
  }
  onChangeCategory(val: string, e) {
    if (e) {
      this.categoryArr.push(val);
    } else {
      const value = this.categoryArr.find(x => x == val);
      const index = this.categoryArr.indexOf(value);
      this.categoryArr.splice(index, 1);
    }
    this.searchSaveArr['category'] = this.categoryArr;
    this.categoryQuery = this.categoryArr.toString();
    this.filterJob();
    //  this.refreshOpenTable(this.filterdata.nativeElement.value);
    //  return false;
  }

  callAfterSearch(search = '') {
    if (typeof search === 'object') {
      this.getSearchVal = search;
      this.categoryID = this.getSearchVal.id;
      this.searchSaveArr['category'] = this.categoryID;
      this.refreshOpenTable(this.filterdata.nativeElement.value);
    }
  }

  redirectJob(jobID) {
    this.router.navigate(['/jobdetail/', jobID]);
  }

  // display the name of category in the input field
  displayname(category) {
    if (category != null) {
      this.initialsearch = category.name;
      return category.name;
    }
  }
  /** Get the initial job list data's for job search functionality*/
  startTable() {
    merge(this.initialTable.dataChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          this.dataSource.filter = this.filterdata.nativeElement.value;
          return this.initialTable!.getRepoApi(
            this.paginator.pageIndex,
            this.dataSource.filter,
            this.jobtypeQuery,
            this.expLevelQuery,
            this.expCompQuery,
            this.commitQuery,
            this.locationQuery,
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
						this.Paginatorhidder = true;
					}else{
						this.Paginatorhidder = false;
					}
          return data.results;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      ).subscribe(data => {
        this.dataSource = data;
      }
      );
  }

  searchMinMaxBudget() {
    this.minBudget = this.minbuget.nativeElement.value;
    this.maxBudget = this.maxbuget.nativeElement.value;
    this.refreshOpenTable(this.filterdata.nativeElement.value);
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
    if (findLength != '' && findLength.length > 1) {
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
    if (findLength != '' && findLength.length > 1) {
      this.maxbuget.nativeElement.value = twoDigit.toFixed(1);
    }
  }

  applyFilter(filterValue: string) {
    filterValue = this.filterdata.nativeElement.value;
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
    this.paginator.pageIndex = 0;
    this.filterJob();
  }

  /** Every filter functionality this function will call & refresh the data's based on search value */
  refreshOpenTable(filterValue = '') {
    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.initialTable!.getRepoApi(
            this.paginator.pageIndex,
            filterValue,
            this.jobtypeQuery,
            this.expLevelQuery,
            this.expCompQuery,
            this.commitQuery,
            this.locationQuery,
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
            this.Paginatorhidder = true;
          }else{
            this.Paginatorhidder = false;
          }
          return data.results;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      ).subscribe(data => {
        this.dataSource = data;
      }
      );
  }
  /** Save the search history text and search value to the API*/
  saveSearch() {
    const jobfilter = this.filterdata.nativeElement.value;
    if (jobfilter !== '' && jobfilter != null) {
      const filterSave = {
        'user': this.user_ID,
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
      this.apiService.postRequest(constant.apiurl + constant.job_search_save, filterSave).subscribe(
        data => {
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
  /** Function is used for save the job post */
  updateWishlist(jobID) {
    const params = {
      'user': this.user_id,
      'job': jobID
    };
    this.apiService.putRequest(constant.apiurl + constant.updateWishlist, params).subscribe(
      data => {
        this.responseSavePost = data;
        if (this.responseSavePost.id != '') {
          let msg = '';
          if (this.responseSavePost.iswishlist)
            msg = 'Job post is saved';
          else
            msg = 'Saved job deleted successfully';
          this.startTable();
          this.userservice.snackMessage(msg);
          this.findSavedJobCount();
        }
      }, err => {
        this.savedErrorRes = err;
        if (this.savedErrorRes.error.non_field_errors[0] == 'Wishlist Duplicated') {
          this.userservice.snackMessage('Job already saved');
        } else {
          this.userservice.snackErrorMessage('Something went wrong. Try again');
        }
        // console.log(err);
      });
  }
  notInterestSave() {
    console.log('hiii');
  }
  filterJob() {
    this.startTable();
  //  this.router.navigate(['/search/job'], { queryParams: {search: this.dataSource.filter, skill: this.skillSearch, payment: this.jobtypeQuery, 'experience_level': this.expLevelQuery, 'commitment': this.commitQuery, 'expected_to_complete': this.expCompQuery, 'category_id': this.categoryQuery, 'location': this.locationQuery, 'minValue': this.minBudget, 'maxValue': this.maxBudget, 'budget': this.budgetQuery }, queryParamsHandling: 'merge' });
  }
  skillBasedSearch(skill) {
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
/** We get the initial search job list data's from API */
export class InitialTable {
  username: string = this.apiService.decodejwts().userid;
  constructor(private http: HttpClient, private apiService: ApiService) { }
  dataChange: BehaviorSubject<responseData[]> = new BehaviorSubject<responseData[]>([]);
  SearchjobComponent:SearchjobComponent;
  public get authHeader(): string {
    return `JWT ${localStorage.getItem('exp_token')}`;
  }
  setHeaders() {
    return {
      headers: new HttpHeaders().set('Authorization', this.authHeader)
    };
  }
  getRepoApi(page: number, filter: string, jobtype = '', experience_level = '', exp_comp = '', commit = '', location = '', min = '', max = '', category = '', name = '', skills = '', allwordSearch = '', exactSearch = '', excludeSearch = ''): Observable<responseApi> {
    // filter = filter === '' ? '' : filter;
    if(filter == 'function filter() { [native code] }' ){
      filter = '';
    }else if(filter == 'function filter() {    [native code]}'){
      filter = '';
    }else if(filter == ''){
      filter = '';
    }else{
      filter = filter;
    }
    // console.log("Filter : " + filter)
    const href = constant.apiurl + constant.getalljobdetails;
    const requestUrl = `${href}/?page=${page + 1}&search=${filter}&status=Open&payment=${jobtype}&experience_level=${experience_level}&expected_to_complete=${exp_comp}&commitment=${commit}&location=${location}&minValue=${min}&maxValue=${max}&category=${category}&name=${name}&skills=${skills}&all_words=${allwordSearch}&omit=invited&exact_phrase=${exactSearch}&exclude_word=${excludeSearch}`;
    if(this.username == undefined || null || ''){
      return this.http.get<responseApi>(requestUrl);
    }else{
      return this.http.get<responseApi>(requestUrl, this.setHeaders());
    }
   
  }
}
