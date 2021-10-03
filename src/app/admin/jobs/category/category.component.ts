import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef, ElementRef, Inject } from '@angular/core';
import { HttpHeaders, HttpResponse, HttpXsrfTokenExtractor, HttpClient } from '@angular/common/http';
import { MatSnackBar, MatTableDataSource, MatPaginator, MatSort, MatSortable, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatIcon, PageEvent } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { merge } from 'rxjs/observable/merge';
import { of as observableOf } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';
import { startWith } from 'rxjs/operators/startWith';
import { switchMap } from 'rxjs/operators/switchMap';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { constant } from '../../../../data/constant';
import { ApiService } from '../../../services/api/api.service';
import { Title, Meta, DOCUMENT } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '.././../../../environments/environment';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

 displayedColumns = ['index', 'name', 'status', 'action'];
  categoryDatabase: CategorypyHttpDao | null;
  data: CategroyData[] = [];
  dataSource = new MatTableDataSource<CategroyData>();
  customFilter:string;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  pageEvent: PageEvent;
  perpage = constant.itemsPerPage;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.sort.sort(<MatSortable>{
      id: 'id',
      start: 'desc'
    });
    this.categoryDatabase = new CategorypyHttpDao(this.http);
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.actionbk();
  }

  ConvertToInt(val){
	return parseInt(val);
  }

  actionbk(search:string=''){
  	if (search != '' && typeof search != 'undefined') {
  		merge(this.sort.sortChange, this.paginator.page)
			.pipe(
			startWith({}),
			switchMap(() => {
				this.isLoadingResults = true;
				return this.categoryDatabase!.getPyapi(
					this.sort.active, this.sort.direction, this.paginator.pageIndex, search);
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
  	}else{
	    merge(this.sort.sortChange, this.paginator.page)
	      .pipe(
	        startWith({}),
	        switchMap(() => {
	          this.isLoadingResults = true;
	          return this.categoryDatabase!.getPyapi(
	            this.sort.active, this.sort.direction, this.paginator.pageIndex, this.dataSource.filter);
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

  applyFilter(filterValue: string,empty:number){
    if(empty==0){
     this.dataSource.filter = "";
     this.filter.nativeElement.value = "";
     this.actionbk();
    }else{
      if (filterValue != '' && typeof filterValue != 'undefined') {
      	this.dataSource.filter = filterValue;
        this.paginator.pageIndex = 0;
        if(this.pageEvent){
          this.pageEvent.pageIndex = 0;  
        }
        this.actionbk(filterValue.toLowerCase());  
      }
    }
  }
}

export interface CatsApi {
  results: CategroyData[];
  count: number;
}

export interface CategroyData {
  id: any;
  name: string;
  status: string;
}


export class CategorypyHttpDao {
  constructor(private http: HttpClient) {}
  public get authHeader(): string {
    return `JWT ${localStorage.getItem('exp_token')}`;
  }
  setHeaders() {
    return {
      headers: new HttpHeaders().set('Authorization', this.authHeader)
    };
  }
  getPyapi(sort: string, order: string, page: number, filter: string=''): Observable<CatsApi> {
    const href = constant.apiurl + constant.admincategorylist;
    const requestUrl =
        `${href}?search=${filter}&sort=${sort}&order=${order}&page=${page + 1}`;
    return this.http.get<CatsApi>(requestUrl, this.setHeaders());
  }
}