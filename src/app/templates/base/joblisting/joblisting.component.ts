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
  MatPaginatorModule,
  PageEvent
} from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { merge } from 'rxjs/observable/merge';
import { of as observableOf } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';
import { startWith } from 'rxjs/operators/startWith';
import { switchMap } from 'rxjs/operators/switchMap';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ApiService } from '../../../services/api/api.service';
import { constant } from '../../../../data/constant';
import { Title, Meta, DOCUMENT } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteconfirmComponent } from './../postjob/deleteconfirm/deleteconfirm.component';
import { UserService } from '../../../services/sync/user.service';

@Component({
  selector: 'app-joblisting',
  templateUrl: './joblisting.component.html',
  styleUrls: ['./joblisting.component.css']
})
export class JoblistingComponent implements AfterViewInit {
  displayedColumns = ['jobtitle', 'name', 'status', 'action'];
  initialTable: InitialTable | null;
  dataSource = new MatTableDataSource();
  resultsLength = 0;
  isLoadingResults = false;
  deleteDraftRes: any;
  deleteOpenRes: any;
  onsearch = false;

  @ViewChild('dataPaginator') dataPaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;

  displayedDraftColumns = ['jobtitle', 'name', 'status', 'action'];
  initialDraftTable: InitialDraftTable | null;
  dataDraftSource = new MatTableDataSource();
  resultsDraftLength = 0;
  isLoadingDraftResults = false;
  @ViewChild('dataDraftPaginator') dataDraftPaginator: MatPaginator;
  @ViewChild('draftFilter') draftFilter: ElementRef;

displayedmyColumns = ['job_category', 'job_subcategory', 'title',  'amount', 'action'];
  MycontractDatabase: MycontractpyHttpDao | null;
  data: MycontractlistData[] = [];
  
  customFilter:string;
  resultsmyLength = 0;
  isLoadingmyResults = true;
  isRateLimitReached = false;
  id: number;
  perpage = constant.itemsPerPage;
  @ViewChild('dataMycontractPaginator') dataMycontractPaginator: MatPaginator;

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
    private userservice: UserService
  ) { }

  ngAfterViewInit() {
    this.initialTable = new InitialTable(this.http, this.apiService);
    this.sort.sortChange.subscribe(() => this.dataPaginator.pageIndex = 1);
    this.startTable();

    this.initialDraftTable = new InitialDraftTable(this.http, this.apiService);
    this.startDraftTable();
    this.cdRef.detectChanges();

    this.MycontractDatabase = new MycontractpyHttpDao(this.http, this.apiService);
  
    // this.dataDraftSource.paginator = this.dataDraftPaginator;
    // this.dataSource.paginator = this.dataPaginator;
  }
  postjob(){
    localStorage.removeItem('category');
    localStorage.removeItem('title');
    localStorage.setItem('firstpostck','false');
  }
  dataPaginatorhidder:boolean;
  startTable() {
    merge(this.initialTable.dataChange, this.dataPaginator.page)
      .pipe(
      startWith({}),
      switchMap(() => {
        this.isLoadingResults = true;
        return this.initialTable!.getRepoApi(
          '', this.dataPaginator.pageIndex);
      }),
      map(data => {
        this.isLoadingResults = false;
        this.resultsLength = data.count;
        if(data.count > 10){
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
  dataDraftPaginatorhidder:boolean;
  startDraftTable() {
    merge(this.initialDraftTable.dataDraftChange, this.dataDraftPaginator.page)
      .pipe(
      startWith({}),
      switchMap(() => {
        this.isLoadingDraftResults = true;
        return this.initialDraftTable!.getRepoApi(
         '', this.dataDraftPaginator.pageIndex);
      }),
      map(data => {
        this.isLoadingDraftResults = false;
        this.resultsDraftLength = data.count;
        if(data.count > 10){
          this.dataDraftPaginatorhidder = true;
        }else{
          this.dataDraftPaginatorhidder = false;
        }
        return data.results;
      }),
      catchError(() => {
        this.isLoadingDraftResults = false;
        return observableOf([]);
      })
      ).subscribe(data =>
        this.dataDraftSource.data = data
      );
  }
  
  // delete Open job post
  deleteOpen(jobId) {
    const dialogRefimage = this.dialog.open(DeleteconfirmComponent, {
      disableClose: true,
      data: {}
    });
    dialogRefimage.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        const URL = constant.apiurl + constant.getindivualjobdetails + '/' + jobId + '/';
        this.apiService.deleteRequest(URL, '').subscribe(response => {
          this.deleteOpenRes = response;
          if (this.deleteOpenRes.status === 204) {
            this.userservice.snackMessage('Job Post Deleted Successfully');
            this.refreshOpenTable();
          }
        });
      }
    });
  }

  // delete draft job post
  deleteDraft(jobId) {
    const dialogRefimage = this.dialog.open(DeleteconfirmComponent, {
      disableClose: true,
      data: {}
    });

    dialogRefimage.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        const URL = constant.apiurl + constant.getindivualjobdetails + '/' + jobId + '/';
        this.apiService.deleteRequest(URL, '').subscribe(response => {
          this.deleteDraftRes = response;
          if (this.deleteDraftRes.status === 204) {
            this.userservice.snackMessage('Draft Job Post Deleted Successfully');
            this.refreshDraftTable();
          }
        });
      }
    });
  }

  // refresh draft table
  refreshDraftTable() {
    merge()
    .pipe(
      startWith({}),
      switchMap(() => {
        this.isLoadingDraftResults = true;
        return this.initialDraftTable!.getRepoApi(
          this.draftFilter.nativeElement.value, this.dataDraftPaginator.pageIndex);
      }),
      map(data => data),
      catchError(() => {
        this.isLoadingDraftResults = false;
        return observableOf([]);
      })
      ).subscribe(data => {
        this.isLoadingDraftResults = false;
        // console.log(data);
        if (data['results'] != null && data['results'].length != 0) {
          this.resultsDraftLength = data['count'];
          this.dataDraftSource.data = data['results'];
        } else {
          if (this.dataDraftPaginator.hasPreviousPage()) {
            console.log('hi');
            this.dataDraftPaginator.previousPage();
          } else {
            this.resultsDraftLength = data['count'];
          this.dataDraftSource.data = data['results'];
          }
        }
        return data['results'];
      }
      );
    }

    // refresh Open table
  refreshOpenTable() {
    merge()
    .pipe(
      startWith({}),
      switchMap(() => {
        this.isLoadingResults = true;
        return this.initialTable!.getRepoApi(
          this.filter.nativeElement.value, this.dataPaginator.pageIndex);
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
          console.log(this.dataPaginator)
          this.dataPaginator.length = data['count'];
          return data['results'];
        } else {
          if (this.dataPaginator.hasPreviousPage()) {
            this.dataPaginator.previousPage();
          }
          this.resultsLength = data['count'];
          this.dataSource.data = data['results'];
          return data['results'];
        }
      });
    }

    onjoblistSearch() {
      this.onsearch = true;
      this.refreshOpenTable();
    }
    onjoblistReset() {
      this.filter.nativeElement.value = '';
      this.refreshOpenTable();
    }

    onjoblistDraftSearch() {
      this.onsearch = true;
      this.refreshDraftTable();
    }
    onjoblistDraftReset() {
      this.draftFilter.nativeElement.value = '';
      this.refreshDraftTable();
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
  getRepoApi(searchFilter = '', page: number): Observable<responseApi> {
    const href = constant.apiurl + constant.getalljobdetails;
    const requestUrl = `${href}/?search=${searchFilter}&user=${this.username}&page=${page + 1}&status=Open,Closed`;
    return this.http.get<responseApi>(requestUrl, this.setHeaders());
  }
}
/* Post Table Display - End */
/* Draft Table Display - Start */
export interface responseDraftApi {
  results: responseDraftData[];
  count: number;
}

export interface responseDraftData {
  id: number;
  name: string;
  status: string;
}


export class InitialDraftTable {
  username: string = this.apiService.decodejwts().userid;
  constructor(private http: HttpClient, private apiService: ApiService) { }
  dataDraftChange: BehaviorSubject<responseDraftData[]> = new BehaviorSubject<responseDraftData[]>([]);
  public get authHeader(): string {
    return `JWT ${localStorage.getItem('exp_token')}`;
  }
  setHeaders() {
    return {
      headers: new HttpHeaders().set('Authorization', this.authHeader)
    };
  }
  getRepoApi(searchDraftFilter, page: number): Observable<responseDraftApi> {
    const href = constant.apiurl + constant.getalljobdetails;
    const requestUrl = `${href}/?search=${searchDraftFilter}&user=${this.username}&page=${page + 1}&status=Draft`;
    return this.http.get<responseDraftApi>(requestUrl, this.setHeaders());
  }
}
/* Draft Table Display - End*/

/* Mycontract Table Display - Start */

export interface MycontractApi {
  results: MycontractlistData[];
  count: number;
}

export interface MycontractlistData {
  id: any;
  job_category: string;
  job_subcategory: string;
  title: string;
  amount: string;
  type: string;
}


export class MycontractpyHttpDao {
  constructor(private http: HttpClient, private apiService: ApiService) {}
  public get authHeader(): string {
    return `JWT ${localStorage.getItem('exp_token')}`;
  }
  setHeaders() {
    return {
      headers: new HttpHeaders().set('Authorization', this.authHeader)
    };
  }
  getPyapi(sort: string, order: string, page: number, filter: string=''): Observable<MycontractApi> {
    const href = constant.apiurl + constant.savecontracts;
    const requestUrl =
    `${href}?client=`+this.apiService.decodejwts().userid+`&page=${page + 1}`;
    return this.http.get<MycontractApi>(requestUrl, this.setHeaders());
  }
}

/* Mycontract Table Display - End*/