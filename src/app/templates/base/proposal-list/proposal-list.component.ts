import { Component, AfterViewInit, ViewChild, ChangeDetectorRef, ElementRef, Inject, OnInit } from '@angular/core';
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
import { DeleteconfirmComponent } from './../postjob/deleteconfirm/deleteconfirm.component';

@Component({
  selector: 'app-proposal-list',
  templateUrl: './proposal-list.component.html',
  styleUrls: ['./proposal-list.component.css']
})
export class ProposalListComponent implements AfterViewInit {
  displayedColumns = ['user', 'action'];
  initialTable: InitialTable | null;
  dataSource = new MatTableDataSource(this.dataSource);
  resultsLength = 0;
  isLoadingResults = false;
  deleteOpenRes: any;
  ProposalStatusclicked:boolean = true;
  /** job id get from API URL */
  jobID = '';
  resource = 0;
  totalcount = 0;
  jobData: any;
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
      this.getJobData();
    });
  }

  ngAfterViewInit() {
    this.initialTable = new InitialTable(this.http, this.apiService);
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 1);
    this.startTable();
    this.cdRef.detectChanges();
  }
  getJobData() {
    const url = constant.apiurl + constant.getindivualjobdetails + '/' + this.jobID + '/';
    this.apiService.getRequest(url).subscribe(
      row => {
        if (row['status'] === 200 && row['ok'] === true) {
          this.jobData = row;
          this.resource = parseInt(this.jobData.body.resource);
          this.totalcount = parseInt(this.jobData.body.offer_status);
        }
      });
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

  // refresh Open table
  refreshOpenTable() {
    merge()
    .pipe(
      startWith({}),
      switchMap(() => {
        this.isLoadingResults = true;
        return this.initialTable!.getRepoApi(
          this.paginator.pageIndex, this.jobID);
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
          return data['results'];
        } else {
          if (this.paginator.hasPreviousPage()) {
            this.paginator.previousPage();
          }
        }
      });
    }

    cancelProposal(freelancerId) {
      this.ProposalStatusclicked = false;
      const params = {
        'id': freelancerId.id,
        'status': 'Cancel',
        'job': this.jobID
      };
      this.apiService.putRequest(constant.apiurl + constant.proposalacceptreject, params ).subscribe(row => {
        console.log(row);
        this.refreshOpenTable();
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
    const requestUrl = `${href}/?job=${jobId}&page=${page + 1}`;
    return this.http.get<responseApi>(requestUrl, this.setHeaders());
  }
}
/* Post Table Display - End */
