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
import { Title, Meta, DOCUMENT } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from './../../../environments/environment';
import * as moment from 'moment';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {
  displayedColumns = ['index', 'user_name', 'category_name', 'sub_categorie_name', 'name', 'payment', 'status', 'created', 'action'];
  JobsDatabase: JobspyHttpDao | null;
  data: JobslistData[] = [];
  dataSource = new MatTableDataSource<JobslistData>();
  customFilter: string;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  pageEvent: PageEvent;
  perpage = constant.itemsPerPage;
  jobStatus = inputData.jobStatus;
  statusFilter = '';
  dateFilter = '';
  categoryFilter = '';
  subcategoryFilter = '';
  catTemp: any;
  subcatTemp: any;
  categoryList: any = [];
  subcategoryList: any = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;

  constructor(private http: HttpClient, private api: ApiService) { }

  ngOnInit() {
    this.JobsDatabase = new JobspyHttpDao(this.http);
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.actionbk();
    this.getCategorynames();
  }
  getCategorynames() {
    var href = constant.apiurl + constant.job_category_all;
    var params = '';
    this.api.getRequest(href + '?' + params).subscribe(
      data => {
        this.catTemp = data;
        this.catTemp.body.forEach(item => { if (item.status == 'Active') { this.categoryList.push(item) } });
      });
  }
  changeCategory(categoryId){
    if(categoryId){
      this.api.getRequest(constant.apiurl + constant.admincategorylist + '/' + categoryId)
      .subscribe(responseData => {
        this.subcatTemp = responseData['body'];
        this.subcategoryList = this.subcatTemp.subcategory;
      });
    }
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
				return this.JobsDatabase!.getPyapi(
          this.sort.active, this.sort.direction, this.paginator.pageIndex, search, this.statusFilter, this.dateFilter, this.categoryFilter, this.subcategoryFilter);
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
	          return this.JobsDatabase!.getPyapi(
              this.sort.active, this.sort.direction, this.paginator.pageIndex, this.dataSource.filter, this.statusFilter, this.dateFilter, this.categoryFilter, this.subcategoryFilter);
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
      this.categoryFilter = "";
      this.subcategoryFilter = "";
      this.actionbk();
    } else {
      if (filterValue != '' && typeof filterValue != 'undefined') {
        this.dataSource.filter = filterValue;
        filterValue = filterValue.toLowerCase();
      } else {
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

export interface JobsApi {
  results: JobslistData[];
  count: number;
}

export interface JobslistData {
  id: any;
  user_name: string;
  category_name: string;
  sub_categorie_name: string;
  name: string;
  payment: string;
  status: string;
  created: string;
}


export class JobspyHttpDao {
  constructor(private http: HttpClient) { }
  public get authHeader(): string {
    return `JWT ${localStorage.getItem('exp_token')}`;
  }
  setHeaders() {
    return {
      headers: new HttpHeaders().set('Authorization', this.authHeader)
    };
  }
  getPyapi(sort: string, order: string, page: number, filter: string = '', status: string = '', datefilter: string = '', catFilter: string = '', subcatFilter:string = ''): Observable<JobsApi> {
    const href = constant.apiurl + constant.adminjobs;

    let requestUrl =
      `${href}?search=${filter}&sort=${sort}&order=${order}&page=${page + 1}`;
    if (status != "") {
      requestUrl = requestUrl + '&status=' + status;
    }
    if (datefilter != "") {
      let formedDate = moment(datefilter).format("YYYY-MM-DD");
      requestUrl = requestUrl + '&created=' + formedDate;
    }
    if(catFilter != ""){
      requestUrl = requestUrl + '&category=' + catFilter;
    }
    if(subcatFilter != ""){
      requestUrl = requestUrl + '&subcategory=' + subcatFilter;
    }
    return this.http.get<JobsApi>(requestUrl, this.setHeaders());
  }
}
