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
import { DeleteconfirmComponent } from './../postjob/deleteconfirm/deleteconfirm.component';
import { UserService } from '../../../services/sync/user.service';

@Component({
  selector: 'app-freelancerproposal',
  templateUrl: './freelancerproposal.component.html',
  styleUrls: ['./freelancerproposal.component.css']
})
export class FreelancerproposalComponent implements AfterViewInit {
  displayedColumns = ['jobtitle', 'status', 'action'];
  initialTable: InitialTable | null;
  dataSource = new MatTableDataSource(this.dataSource);
  resultsLength = 0;
  isLoadingResults = false;
  deleteOpenRes: any;
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
    private route: ActivatedRoute,
    private userservice: UserService
  ) { }

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
          this.paginator.pageIndex);
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
            this.userservice.snackMessage('Job Post Deleted Successfully.');
            this.refreshOpenTable();
          }
        });
      }
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
          this.paginator.pageIndex);
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
  userID: string = this.apiService.decodejwts().userid;
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
  getRepoApi(page: number): Observable<responseApi> {
    const href = constant.apiurl + constant.job_proposal;
    const requestUrl = `${href}?user=${this.userID}&page=${page + 1}`;
    return this.http.get<responseApi>(requestUrl, this.setHeaders());
  }
}
/* Post Table Display - End */