import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { MatTableDataSource, MatPaginator, MatSort, MatSortable, PageEvent } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { merge } from 'rxjs/observable/merge';
import { of as observableOf } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';
import { startWith } from 'rxjs/operators/startWith';
import { switchMap } from 'rxjs/operators/switchMap';
import * as moment from 'moment';

import { constant, inputData } from '../../../data/constant';
@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.css']
})
export class ProposalComponent implements OnInit {
  displayedColumns: string[] = ['index', 'job_id', 'client_name', 'freelancer', 'payment', 'budget', 'status', 'created', 'action'];
  proposalsDatabase: ProposalspyHttpDao | null;
  data: ProposalslistData[] = [];
  dataSource = new MatTableDataSource<ProposalslistData>();
  customFilter: string;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  pageEvent: PageEvent;
  perpage = constant.itemsPerPage;
  hiredLevelTxt = inputData.hiredLevelTxt;
  exp_levels = inputData.experienceLevels;
  proposalStatus = inputData.proposalStatus;
  statusFilter='';
  dateFilter='';
  experienceFilter = ''
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;
  constructor(private http: HttpClient) { }
  ngOnInit() {
    this.sort.sort(<MatSortable>{
      id: 'id',
      start: 'desc'
    });
    this.proposalsDatabase = new ProposalspyHttpDao(this.http);
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.actionbk();
  }

  ConvertToInt(val) {
    return parseInt(val);
  }

  actionbk(search: string = '') {
    if (search != '' && typeof search != 'undefined') {
      merge(this.sort.sortChange, this.paginator.page)
        .pipe(
          startWith({}),
          switchMap(() => {
            this.isLoadingResults = true;
            return this.proposalsDatabase!.getPyapi(
              this.sort.active, this.sort.direction, this.paginator.pageIndex, search,this.statusFilter, this.dateFilter, this.experienceFilter);
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
    } else {
      merge(this.sort.sortChange, this.paginator.page)
        .pipe(
          startWith({}),
          switchMap(() => {
            this.isLoadingResults = true;
            return this.proposalsDatabase!.getPyapi(
              this.sort.active, this.sort.direction, this.paginator.pageIndex, this.dataSource.filter,this.statusFilter, this.dateFilter, this.experienceFilter);
          }),
          map(data => {
            this.isLoadingResults = false;
            this.isRateLimitReached = false;
            this.resultsLength = data.count;

            return data.results;
          }),
          catchError(() => {
            this.isLoadingResults = false;
            this.isRateLimitReached = true;
            return observableOf([]);
          })
        ).subscribe(data => this.data = data);
    }
  }
  applyFilter(filterValue: string, empty: number) {
    if (empty == 0) {
      this.dataSource.filter = "";
      this.filter.nativeElement.value = "";
      this.statusFilter = "";
      this.dateFilter = "";
      this.experienceFilter = "";
      this.actionbk();
    } else {
      if (filterValue != '' && typeof filterValue != 'undefined'){
        this.dataSource.filter = filterValue;
        filterValue = filterValue.toLowerCase();
      }else{
        filterValue = "";
      }
      this.paginator.pageIndex = 0;
        if (this.pageEvent) {
          this.pageEvent.pageIndex = 0;
        }
        this.actionbk(filterValue);
    }
  }

}
export interface ProposalsApi {
  results: ProposalslistData[];
  count: number;
}

export interface ProposalslistData {
  id: any;
  job_id: any;
  title: string;
  client_name: string;
  username: string;
  bid_amount: string;
  created: string;
  status: string;
  experience_level: string;
  payment: string;
  name: string;
  payment_amount: number;
  freelancer_name: string;
}


export class ProposalspyHttpDao {
  constructor(private http: HttpClient) { }
  public get authHeader(): string {
    return `JWT ${localStorage.getItem('exp_token')}`;
  }
  setHeaders() {
    return {
      headers: new HttpHeaders().set('Authorization', this.authHeader)
    };
  }
  getPyapi(sort: string, order: string, page: number, filter: string = '', status: string = '',datefilter: string = '', expFilter:string = ''): Observable<ProposalsApi> {
    const href = constant.apiurl + constant.job_proposal;

    let requestUrl =
      `${href}?search=${filter}&sort=${sort}&order=${order}&page=${page + 1}`;
    if(status != ""){
      requestUrl = requestUrl+'&status='+status;
    }
    if(datefilter != ""){
      let formedDate = moment(datefilter).format("YYYY-MM-DD");
      requestUrl = requestUrl+'&created='+formedDate;
    }
    if(expFilter != ""){
      requestUrl = requestUrl+'&job__experience_level='+expFilter;
    }
    return this.http.get<ProposalsApi>(requestUrl, this.setHeaders());
  }
}
