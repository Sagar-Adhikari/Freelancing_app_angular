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

@Component({
  selector: 'app-freelance-contract',
  templateUrl: './freelance-contract.component.html',
  styleUrls: ['./freelance-contract.component.css']
})
export class FreelanceContractComponent implements AfterViewInit {
 
  displayedmyColumns = ['job_category', 'job_subcategory', 'title',  'amount', 'action'];
  MycontractDatabase: MycontractpyHttpDao | null;
  data: MycontractlistData[] = [];
  datamycontractSource = new MatTableDataSource<MycontractlistData>();
  customFilter:string;
  resultsmyLength = 0;
  isLoadingmyResults = true;
  isRateLimitReached = false;
  id: number;
  perpage = constant.itemsPerPage;
  @ViewChild('dataMycontractPaginator') dataMycontractPaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;

  constructor(
    private http: HttpClient,
    private cdRef: ChangeDetectorRef,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private apiService: ApiService,
    @Inject(DOCUMENT) private document: HTMLDocument,
    private titleService: Title,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngAfterViewInit() {
    this.MycontractDatabase = new MycontractpyHttpDao(this.http, this.apiService);
    this.startMycontractTable();
  }

  mycontractpaginationhide:boolean;
   startMycontractTable(search:string=''){
      merge(this.sort.sortChange, this.dataMycontractPaginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingmyResults = true;
          return this.MycontractDatabase!.getPyapi(
            this.sort.active, this.sort.direction, this.dataMycontractPaginator.pageIndex, this.datamycontractSource.filter);
        }),
        map(data => {
          this.isLoadingmyResults = false;
          this.isRateLimitReached = false;
          this.resultsmyLength = data.count;

          return data.results;
        }),
        catchError(() => {
          this.isLoadingmyResults = false;
          this.isRateLimitReached = true;
          return observableOf([]);
        })
        ).subscribe(data =>{
          // this.mycontractpaginationhide
          if(data.length > 10){
            this.mycontractpaginationhide = true;
          }else{
            this.mycontractpaginationhide = false;
          }
          this.datamycontractSource.data = data
        });
  }

  

}


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
    `${href}?freelancer=`+this.apiService.decodejwts().userid+`&offer_status=Accept&page=${page + 1}`;
    return this.http.get<MycontractApi>(requestUrl, this.setHeaders());
  }
}

/* Mycontract Table Display - End*/