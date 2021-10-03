/**
 * Page : Search Freelancer
 * Use : User can search freelancer details based on differet filter
 * Page Functionality :
 * >>> Create the material Table
 * >>> Added the freelancer filter option ( hourly rate, english level, category & location )
 * >>> User can display the specific user details
 * Created Date : 04/08/2018
 * Modified Date : 17/08/2018
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
import { UserService } from './../../../services/sync/user.service';
import { country } from '../../../../data/country';
import { MatTabChangeEvent } from '@angular/material';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-searchfreelancer',
  templateUrl: './searchfreelancer.component.html',
  styleUrls: ['./searchfreelancer.component.css']
})
export class SearchfreelancerComponent implements AfterViewInit {
  // Material table variable declaration and define
  resetCheck = false;
  panelOpenState = false;
  displayedColumns = ['jobtitle'];
  customFilter: string;
  customFilterdraft: string;
  initialTable: InitialTable | null;
  dataSource = new MatTableDataSource(this.dataSource);
  resultsLength = 0;
  isLoadingResults = false;
  deleteOpenRes: any;
  tag: any;
  isExpanded = false;
  @ViewChild('dataPaginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;
  pageEvent: PageEvent;
  exp_levels: any = [];
  paylists: any = [];
  exp_comps: any = [];
  countries: any = country.list;
  search;
  categorylists: any; initialsearch: any;

  // Search variable declaration
  hourLateSearch: any;
  hourly_rateVal: any;
  engLevel: any;
  categoryName: any;
  location: any;
  image_url = constant.imgurl;
  category_id = '';

  // View all tab variable declartion & define
  displayedDraftColumns = ['jobtitle'];
  initialDraftTable: InitialDraftTable | null;
  dataDraftSource = new MatTableDataSource(this.dataDraftSource);
  resultsDraftLength = 0;
  isLoadingDraftResults = false;
  savedErrorRes: any;
  @ViewChild('dataDraftPaginator') dataDraftPaginator: MatPaginator;

  englevels = [
    { 'key': 'Any', 'name': 'Any' },
    { 'key': 'Elementary', 'name': 'Elementary' },
    { 'key': 'Intermediate', 'name': 'Intermediate' },
    { 'key': 'Advanced', 'name': 'Advanced' },
    { 'key': 'Proficient', 'name': 'Proficient' }
  ];

  hourlyRates = [
    { 'key': '1', 'name': 'any' },
    { 'key': '2', 'name': 'Rs.1000 and below' },
    { 'key': '3', 'name': 'Rs.1000 - Rs.2000' },
    { 'key': '4', 'name': 'Rs.2000 - Rs.5000' },
    { 'key': '5', 'name': 'Rs.5000 & above' }
  ];
  searchDisplayForm: FormGroup;
  profileDetails: any = [];
  queryUserID = this.apiService.decodejwts().userid + '/';
  userCategoryName = '';
  userLocation = '';
  userLogged = false;
  // Variable declaration for freelancer saved
  responseSaveFreelancer: any;
  userType: string = this.apiService.decodejwts().user_type;
  dataPaginatorhidder:any;
  dataDraftPaginatorhidder:any;
  TableViewedInDisplay:boolean;
  defaulttableview:number;
  userid: string = this.apiService.decodejwts().userid;
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
    private usersService: UserService,
    private ratingConfig: NgbRatingConfig,
  ) {
    this.ratingConfig.max = inputData.maximumRatingConfig;
    this.ratingConfig.readonly = true;
    // Search filter form declaration
    this.searchDisplayForm = fb.group({
      '                                                                                                                                                                                                       ' : null,
      'hourlyratefld': null,
      'englevelfld': null,
      'categoryfld': null,
      'locationfld': null,
      'searchfreelancer': null,
      'customsearchfilter':null,
    });
  }
  ngAfterViewInit() {
    if(localStorage.getItem('freelancerview') == 'true'){
      this.TableViewedInDisplay = true;
      this.defaulttableview=0;
    }else if(localStorage.getItem('freelancerview') == 'false'){
      this.TableViewedInDisplay = false;
      this.defaulttableview=1;
    }else{
      this.TableViewedInDisplay = true;
      this.defaulttableview=0;
    }
    // this.dataSource.paginator = this.paginator;
    this.filter.nativeElement.value = localStorage.getItem('search_by');
    localStorage.removeItem('search_by');
    this.route.queryParams.subscribe(params => {
      if (params.page != '' && typeof params.page != 'undefined') {
        this.paginator.pageIndex = params.page;
      }
    });
    // if (this.apiService.decodejwts().userid != null) {
      this.initialTable = new InitialTable(this.http, this.apiService);
      this.startTable();
    // }
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 1);

    this.initialDraftTable = new InitialDraftTable(this.http, this.apiService);
    if(this.userType !== 'Freelancer' || undefined){
    this.startViewAllTable();
    }
    this.cdRef.detectChanges();
  }
  panelExpand(expanded) {
    this.isExpanded = expanded === false ? true : false;
  }

  ngOnInit() {

    this.route.params.subscribe(params => {
      const urlParamsVal = params['category'];
      const urltagVal = params['tag'];
      if (urlParamsVal !== '') {
        this.categoryName = urlParamsVal;
      }
      if (urltagVal !== '') {
        this.tag = urltagVal;
      }
    });
    if (this.apiService.decodejwts().userid != null) {
      this.userType = this.apiService.decodejwts().user_type;
      this.userLogged = true;
    } else {
      this.dataDraftSource.filter = '';
    }
  }

  selectEngType(engType) {
    this.engLevel = engType === 'Any' ? '' : engType;
    if (this.userLogged) {
      this.refreshOpenTable(this.filter.nativeElement.value);
      if(this.userType !== 'Freelancer' || undefined){
        this.refreshDraftTable(this.filter.nativeElement.value);
      }
    }else{
      // this.refreshOpenTable(this.filter.nativeElement.value);
      this.filteredNotLogged();
    }
  }

  selectHourly(hourly) {
    this.hourLateSearch = hourly;
    
    if (this.userLogged) {
      this.refreshOpenTable(this.filter.nativeElement.value);
      if(this.userType !== 'Freelancer' || undefined){
        this.refreshDraftTable(this.filter.nativeElement.value);
      }
    }else{
      // this.refreshOpenTable(this.filter.nativeElement.value);
      this.filteredNotLogged();
    }
  }

  onSelectedCountry(countryValue) {
    this.location = countryValue;
    if (this.userLogged) {
      this.refreshOpenTable(this.filter.nativeElement.value);
      if(this.userType !== 'Freelancer' || undefined){
        this.refreshDraftTable(this.filter.nativeElement.value);
      }
    }else{
      // this.refreshOpenTable(this.filter.nativeElement.value);
      this.filteredNotLogged();
    }
  }

  // Initial category list display & filter option
  filtercategorylists(search = '') {
    if (typeof search === 'object' && search != null) {
      this.initialsearch = search;
      search = this.initialsearch.name;
    }
  
    this.apiService.getRequest(constant.apiurl + constant.job_category_all + '?search=' + search)
      .subscribe(response => {
        this.categorylists = response['body'];
      });
  }

  onSelectedCate(value) {
    if (typeof value === 'object' && value != null) {
      this.categoryName = value.id;
      if (this.userLogged) {
        this.refreshOpenTable(this.filter.nativeElement.value);
        if(this.userType !== 'Freelancer' || undefined){
          this.refreshDraftTable(this.filter.nativeElement.value);
        }
      } else {
        // this.refreshOpenTable(this.filter.nativeElement.value);
        this.filteredNotLogged();
      }
    }
  }

  /** Display the name of category in the input field */
  displayname(category) {
    if (category != null) {
      this.initialsearch = category.name;
      return category.name;
    }
  }

  onSearchClear() {
    if(this.tag){
      this.router.navigate(['/search/freelancer']);
    }else{
      this.filter.nativeElement.value = '';
      this.dataSource.filter = '';
      this.engLevel = '';
      this.categoryName = '';
      this.tag = '';
      this.location = '';
      this.hourLateSearch = '';
      this.resetCheck = false;
      this.searchDisplayForm.patchValue({
        'hourlyratefld': null,
        'englevelfld': null,
        'categoryfld': null,
        'locationfld': null
      });
      if (this.userLogged) {
        this.refreshOpenTable();
        if(this.userType !== 'Freelancer' || undefined){
          this.refreshDraftTable();
        }
      }else{
        this.filteredNotLogged();
      }
    }
    
    // this.refreshOpenTable();
    
  }
  bestmatch(event: MatTabChangeEvent){
    //for checking user views freelancer or wishlist
    if(this.TableViewedInDisplay){
      this.TableViewedInDisplay = false;
      localStorage.setItem('freelancerview','false');
    }else{
      this.TableViewedInDisplay = true;
      localStorage.setItem('freelancerview','true');
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
            this.engLevel,
            this.categoryName,
            this.location,
            this.hourLateSearch,
            this.tag
          );
        }),
        map(data => {
          this.isLoadingResults = false;
          // console.log(data)
          if(this.userid !== undefined){
            this.resultsLength = data['body'].count;
            if(data['body'].count > 10){
                        this.dataPaginatorhidder = true;
                      }else{
                        this.dataPaginatorhidder = false;
                      }
            return data['body'].results;
          }else{
            this.resultsLength = data.count;
            if(data.count > 10){
                        this.dataPaginatorhidder = true;
                      }else{
                        this.dataPaginatorhidder = false;
                      }
            return data.results;
          }
           
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      ).subscribe(data => {
        this.dataSource.data = data;
      }
      );
  }
  
  startViewAllTable() {
    merge(this.initialDraftTable.dataDraftChange, this.dataDraftPaginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingDraftResults = true;
          this.dataDraftSource.filter = this.filter.nativeElement.value;
          return this.initialDraftTable!.getRepoApi(
            this.dataDraftPaginator.pageIndex,
            this.dataDraftSource.filter,
            this.engLevel,
            this.categoryName,
            this.location,
            this.hourLateSearch,
            this.tag);
        }),
        map(data => {
          this.isLoadingDraftResults = false;
          this.resultsDraftLength = data['body'].count;
          if(data['body'].count > 10){
            this.dataDraftPaginatorhidder = true;
          }else{
            this.dataDraftPaginatorhidder = false;
          }
          return data['body'].results;
        }),
        catchError(() => {
          this.isLoadingDraftResults = false;
          return observableOf([]);
        })
      ).subscribe(data => {
        this.dataDraftSource.data = data
      }
      );
  }
  filteredNotLogged(){
    const href = constant.apiurl + constant.updateUserDetails;
    if(this.paginator.pageIndex == undefined){
      this.paginator.pageIndex = 0;
    }
    if(this.dataSource.filter == undefined){
      this.dataSource.filter = '';
    }
    if(this.engLevel == undefined){
      this.engLevel = '';
    }
    if(this.categoryName == undefined){
      this.categoryName = '';
    }
    if(this.tag == undefined){
      this.tag = '';
    }
    if(this.location == undefined){
      this.location = '';
    }
    if(this.hourLateSearch == undefined){
      this.hourLateSearch = '';
    }
    let requestUrl = `${href}?profile__user_type=Freelancer&page=${this.paginator.pageIndex + 1}&search=${this.dataSource.filter}&profile__english_level=${this.engLevel}&profile__category_name=${this.categoryName}&profile__country=${this.location}&hourly_rate=${this.hourLateSearch}&profile__offer_skill=${this.tag}&visibility=Public`;
    this.http.get(requestUrl).subscribe(data => {
      this.isLoadingResults = true;
      this.dataSource.filter = this.filter.nativeElement.value;
      this.resultsLength = data['count'];
      if(data['count'] > 10){
        this.dataPaginatorhidder = true;
      }else{
        this.dataPaginatorhidder = false;
      }
      this.dataSource.data = data['results'];
      // this.dataSource.paginator =  this.paginator;
    },error => console.log('error'))
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.toLowerCase();
    if (this.userLogged) {
      this.dataSource.filter = filterValue;
      this.paginator.pageIndex = 0;
      this.refreshOpenTable(filterValue);
      if(this.userType !== 'Freelancer' || undefined){
        this.refreshDraftTable(filterValue);
      }
    } else {
      this.dataDraftSource.filter = filterValue;
      this.dataDraftPaginator.pageIndex = 0;
      this.refreshOpenTable(filterValue);
    }
  }

  /** Function used to refresh the table and data's fetch based on every filter search */
  refreshOpenTable(filterValue = '') {
    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          this.paginator.pageIndex = 0;
          if (this.userLogged) {
          this.dataSource.filter = this.filter.nativeElement.value;
          return this.initialTable!.getRepoApi(
            this.paginator.pageIndex,
            this.dataSource.filter,
            this.engLevel,
            this.categoryName,
            this.location,
            this.hourLateSearch,
            this.tag);
          } else {
             this.initialTable!.getRepoApi(
              this.paginator.pageIndex,
              this.dataSource.filter,
              this.engLevel,
              this.categoryName,
              this.location,
              this.hourLateSearch,
              this.tag);
          }
        }),
        map(data => {
          this.isLoadingResults = false;
          this.resultsLength = data['body'].count;
          // console.log(data)
          if(data['body'].count > 10){
            this.dataPaginatorhidder = true;
          }else{
            this.dataPaginatorhidder = false;
          }
          return data['body'].results;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      ).subscribe(data => {
        this.isLoadingResults = false;
        this.dataSource.data = data;
        return this.dataSource;
      });
  }

  refreshDraftTable(filterValue = '') {
    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingDraftResults = true;
          if (this.userLogged) {
            this.dataDraftSource.filter = filterValue;
            return this.initialDraftTable!.getRepoApi(
              this.dataDraftPaginator.pageIndex,
              this.dataDraftSource.filter,
              this.engLevel,
              this.categoryName,
              this.location,
              this.hourLateSearch,
              this.tag);
          } else {
            return this.initialDraftTable!.getRepoApi(
              this.dataDraftPaginator.pageIndex,
              this.dataDraftSource.filter,
              this.engLevel,
              this.categoryName,
              this.location,
              this.hourLateSearch,
              this.tag);
          }

        }),
        map(data => data),
        catchError(() => {
          this.isLoadingDraftResults = false;
          return observableOf([]);
        })
      ).subscribe(data => {
        this.isLoadingDraftResults = false;
        if (data['body'].results != null) {
          if(data['body'].count > 10){
            this.dataDraftPaginatorhidder = true;
          }else{
            this.dataDraftPaginatorhidder = false;
          }
          this.resultsDraftLength = data['body'].count;
          this.dataDraftSource.data = data['body'].results;
          return data['body'].results;
        } else {
          if (this.dataDraftPaginator.hasPreviousPage()) {
            this.dataDraftPaginator.previousPage();
          }
        }
      }
      );
  }

  onSavedFreelancer(freelancerId, wishid) {
    document.getElementById(freelancerId).setAttribute("disabled","disabled");
    const params = {
      'user': this.apiService.decodejwts().userid,
      'freelancer': freelancerId
    };

    let str = document.getElementById(freelancerId).getAttribute('class')
    let res = str.match('isoffwishlist');
    let reson = str.match('isonwishlist');
    if ((reson !== null) && (reson[0] === 'isonwishlist')) {
      this.onDeleteFreelancer(wishid);
      this.startTable();
      this.startViewAllTable();
      return false;
    } else if ((res !== null) && (res[0] === 'isoffwishlist')) {
      
      this.Addwishlistfreelancerfunc(params);
      this.startTable();
      this.startViewAllTable();
      return false;
    } else {
      console.log("networrk issues");
      return false;
    }
  }

  Addwishlistfreelancerfunc(params) {
    this.apiService.postRequest(constant.apiurl + constant.freelancerwishlistadd + '/', params).subscribe(
      data => {
        this.responseSaveFreelancer = data;
        document.getElementById(params.freelancer).removeAttribute("disabled");
        if (this.responseSaveFreelancer.id != '') {
          this.snackBar.open('Freelancer saved to wishlist', '', {
            duration: 2000,
            verticalPosition: 'top'
          });
        }
      }, err => {
        this.savedErrorRes = err;
        if (this.savedErrorRes.error.non_field_errors[0] == 'Wishlist Duplicated') {
          this.snackBar.open('Freelancer already added to the wishlist', '', {
            duration: 2000,
            verticalPosition: 'top'
          });
        }
      });
      this.startTable();
      this.startViewAllTable();
  }
  onDeleteFreelancer(savedUserId) {
    this.apiService.deleteRequest(constant.apiurl + constant.freelancerwishlist + '/' + savedUserId + '/', '')
      .subscribe(response => {
        this.snackBar.open('Saved Freelancer deleted successfully', '', {
          duration: 2000,
          verticalPosition: 'top'
        });
        //  this.refreshDraftTable();
        this.startTable();
        this.startViewAllTable();
      });
  }
}

export interface responseApi {
  results: responseData[];
  count: number;
}

export interface responseData {
  id: number;
  first_name: string;
  last_name: string;
  profile: any;
}
/** We get the initial search freelancer list data's from API, 'Best Match' tab use this function */
export class InitialTable{
  username: string = this.apiService.decodejwts().userid;
  constructor(private http: HttpClient, private apiService: ApiService) { }
  dataChange: BehaviorSubject<responseData['profile']> = new BehaviorSubject<responseData['profile']>([]);
  public get authHeader(): string {
    return `JWT ${localStorage.getItem('exp_token')}`;
  }
  getRepoApi(page: number, filter: string, engLevel = '', categoryName = '', location = '', hourly = '', tag = ''): Observable<responseApi> {
    filter = filter === '' ? '' : filter;
    const href = constant.apiurl + constant.updateUserDetails;
    let requestUrl:string;
    const options = {};
    // console.log("und",this.username)
    if(this.username !== undefined){
      requestUrl = `${href}?profile__user_type=Freelancer&page=${page + 1}&search=${filter}&profile__english_level=${engLevel}&profile__category_name=${categoryName}&profile__offer_skill=${tag}&profile__country=${location}&hourly_rate=${hourly}&visibility=Public,User Only`;
    }else{
      requestUrl = `${href}?profile__user_type=Freelancer&page=${page + 1}&search=${filter}&profile__english_level=${engLevel}&profile__category_name=${categoryName}&profile__offer_skill=${tag}&profile__country=${location}&hourly_rate=${hourly}&visibility=Public`;
    }
    options['observe'] = 'response';
    options['headers'] = new HttpHeaders().set('Authorization', this.authHeader);
    
    if(this.username !== undefined){
      return this.http.get<responseApi>(requestUrl, options);
    }else{
      return this.http.get<responseApi>(requestUrl);
    }
    
  }
}

export interface responseDraftApi {
  results: responseDraftData[];
  count: number;
}

export interface responseDraftData {
  id: number;
  name: string;
  status: string;
}
/** We get the initial search freelancer list data's from API, 'View All' tab use this function */
export class InitialDraftTable {
 
  constructor(private http: HttpClient, private apiService: ApiService) { }
  username: string = this.apiService.decodejwts().userid;
  dataDraftChange: BehaviorSubject<responseDraftData[]> = new BehaviorSubject<responseDraftData[]>([]);

  public get authHeader(): string {
    return `JWT ${localStorage.getItem('exp_token')}`;
  }
  getRepoApi(page: number, filter: string, engLevel = '', categoryName = '', location = '', hourly = '', tag = ''): Observable<responseDraftApi> {
    const href = constant.apiurl + constant.freelancerwishlist + '/';
   
    // const requestUrl = `${href}?user=${this.username}&?freelancer__profile__user_type=Freelancer&page=${page + 1}&search=${filter}&freelancer__profile__english_level=${engLevel}&freelancer__profile__category=${categoryName}&freelancer__profile__offer_skill=${tag}&freelancer__profile__country=${location}&freelancer__profile__hourly_rate=${hourly}`;
    const requestUrl = `${href}?profile__user_type=Freelancer&page=${page + 1}&search=${filter}&profile__english_level=${engLevel}&profile__category_name=${categoryName}&profile__offer_skill=${tag}&profile__country=${location}&hourly_rate=${hourly}`;
    const options = {};
    options['observe'] = 'response';
    options['headers'] = new HttpHeaders().set('Authorization', this.authHeader);
    return this.http.get<responseDraftApi>(requestUrl, options);
  }
}