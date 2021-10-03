import { Component, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef, Inject } from '@angular/core';
import { HttpHeaders,  HttpClient } from '@angular/common/http';
import {
  MatTableDataSource,
  MatPaginator,
  MatSort,
  MatDialog,
  MatSnackBar
} from '@angular/material';

import { Observable } from 'rxjs/Observable';
import { merge } from 'rxjs/observable/merge';
import { startWith } from 'rxjs/operators/startWith';
import { switchMap } from 'rxjs/operators/switchMap';
import { map } from 'rxjs/operators/map';
import { of as observableOf } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators/catchError';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Title, DOCUMENT } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { constant } from '../../../../data/constant';
import { ApiService } from '../../../services/api/api.service';
@Component({
  selector: 'app-list-proposal',
  templateUrl: './list-proposal.component.html',
  styleUrls: ['./list-proposal.component.css']
})
export class ListProposalComponent implements AfterViewInit {
  displayedColumns = ['user', 'action'];
  initialTable: InitialTable | null;
  dataSource = new MatTableDataSource(this.dataSource);
  resultsLength = 0;
  isLoadingResults = false;
  deleteOpenRes: any;
  /** job id get from API URL */
  jobID = '';
  image_url = constant.imgurl;

  @ViewChild('dataPaginator') paginator: MatPaginator;
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

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.jobID = params['job'];
    });
  }
  ngAfterViewInit() {
    this.initialTable = new InitialTable(this.http, this.apiService);
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 1);
    this.startTable();
    this.cdRef.detectChanges();
  }
  startTable() {
    merge(this.initialTable.dataChange, this.paginator.page)
      .pipe(
      startWith({}),
      switchMap(() => {
        this.isLoadingResults = true;
        return this.initialTable!.getRepoApi(
          this.paginator.pageIndex, this.jobID);
      }),
      map(data => {
        this.isLoadingResults = false;
        this.resultsLength = data.count;
        return data.results;
      }),
      catchError(() => {
        this.isLoadingResults = false;
        return observableOf([]);
      })
      ).subscribe(data => {
        console.log(data);
        this.dataSource.data = data;
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
  avatar: string;
  first_name: string;
  last_name: string;
  description: string;
  daily_availability: string;
  country: string;
  user: string;
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
  getRepoApi(page: number, jobId): Observable<responseApi> {
    const href = constant.apiurl + constant.jobproposallist;
    // const requestUrl = `${href}/?job=${jobId}&page=${page + 1}&status=Request`;
    const requestUrl = `${href}/?job=${jobId}&page=${page + 1}`;
    return this.http.get<responseApi>(requestUrl, this.setHeaders());
  }
}
/* Post Table Display - End */