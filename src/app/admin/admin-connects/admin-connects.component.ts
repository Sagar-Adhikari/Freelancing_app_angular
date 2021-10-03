import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef, ElementRef, Inject } from '@angular/core';
import { HttpHeaders, HttpResponse, HttpXsrfTokenExtractor, HttpClient } from '@angular/common/http';
import { MatSnackBar, MatTableDataSource, MatPaginator, MatSort, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatIcon, PageEvent } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { merge } from 'rxjs/observable/merge';
import { of as observableOf } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';
import { startWith } from 'rxjs/operators/startWith';
import { switchMap } from 'rxjs/operators/switchMap';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { constant, inputData } from '../../../data/constant';
import { ApiService } from '../../services/api/api.service';

export interface Lastdays {
  value: string;
  viewValue: string;
}
export interface Allconnects {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-admin-connects',
  templateUrl: './admin-connects.component.html',
  styleUrls: ['./admin-connects.component.css']
})
export class AdminConnectsComponent implements OnInit {

  displayedColumns: string[] = ['date', 'description', 'username', 'conntecttype', 'amount', 'balance'];
  historyDatabase: ConnectHistoryspyHttpDao | null;
  data: ConnecthistorylistData[] = [];
  dataSource = new MatTableDataSource<ConnecthistorylistData>();
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  pageEvent: PageEvent;
  perpage = constant.itemsPerPage;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;
  lastdays: Lastdays[] = inputData.connectsFilterDays;
  allconnects: Allconnects[] = inputData.connectsFilterTypes;
  lastDayFilter: any = "";
  connectTypeFilter: any = "";
  searchFilter: any = "";
  constructor(private http: HttpClient, private api: ApiService) { }

  ngOnInit() {
    this.historyDatabase = new ConnectHistoryspyHttpDao(this.http);
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.actionbk();
  }
  actionbk() {
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.historyDatabase!.getPyapi(this.paginator.pageIndex, this.searchFilter, this.lastDayFilter, this.connectTypeFilter);
        }),
        map(data => {
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.count;
          this.dataSource.data = data.results;
          if (data.results.length == 0) {
            if (this.paginator.hasPreviousPage()) {
              this.paginator.previousPage();
            }
            return data.results;
          } else {
            return data.results;
          }
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe(data => this.data = data);
  }
  applyFilter(empty: number) {
    if (empty == 0) {
      this.lastDayFilter = "";
      this.connectTypeFilter = "";
      this.searchFilter = "";
      this.actionbk();
    } else {
      this.paginator.pageIndex = 0;
      if (this.pageEvent) {
        this.pageEvent.pageIndex = 0;
      }
      this.actionbk();
    }
  }

}
export interface ConnectsHistoryApi {
  results: ConnecthistorylistData[];
  count: number;
}

export interface ConnecthistorylistData {
  id: any;
  username: string;
  balance: any;
  job_id: string;
  user_id: string;
  type: string;
  connect_type: string;
  connects: number;
  job_name: string;
  description: string;
  created: string;
}


export class ConnectHistoryspyHttpDao {
  constructor(private http: HttpClient) { }
  public get authHeader(): string {
    return `JWT ${localStorage.getItem('exp_token')}`;
  }
  setHeaders() {
    return {
      headers: new HttpHeaders().set('Authorization', this.authHeader)
    };
  }
  getPyapi(page: number, search: string = '', days: string = '', connectType: string = ''): Observable<ConnectsHistoryApi> {
    const href = constant.apiurl + constant.connectHistory;
    if(connectType == 'All Connects'){
      connectType = '';
    }
    let requestUrl = `${href}?search=${search}&days=${days}&connect_type=${connectType}&page=${page + 1}`;
    return this.http.get<ConnectsHistoryApi>(requestUrl, this.setHeaders());
  }
}
