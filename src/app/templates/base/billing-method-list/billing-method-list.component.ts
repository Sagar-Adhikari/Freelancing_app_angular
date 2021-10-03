import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef, ElementRef, Inject, Input } from '@angular/core';
import { HttpHeaders, HttpResponse, HttpXsrfTokenExtractor, HttpClient } from '@angular/common/http';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatIcon, PageEvent } from '@angular/material';
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
import { UserService } from '../../../services/sync/user.service';
import { Title, Meta, DOCUMENT } from '@angular/platform-browser';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { DeleteBillingMethodComponent } from './../billing-method-list/delete-billing-method/delete-billing-method.component';

@Component({
  selector: 'app-billing-method-list',
  templateUrl: './billing-method-list.component.html',
  styleUrls: ['./billing-method-list.component.css']
})
export class BillingMethodListComponent implements OnInit {

    displayedColumns = ['index', 'brand', 'action'];
	MycardDatabase: MycardspyHttpDao | null;
	data: MycardlistData[] = [];
	dataSource = new MatTableDataSource<MycardlistData>();
	customFilter:string;
	resultsLength = 0;
	isLoadingResults = true;
	isRateLimitReached = false;
	pageEvent: PageEvent;
	id: number;
	perpage = constant.itemsPerPage;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('filter') filter: ElementRef;
	billing_result:any;
	@Input() freelancer_id:any;
	constructor(private http: HttpClient,  public dialog: MatDialog, private usersService: UserService, private apiService: ApiService, private router:Router) {

		this.router.events.subscribe((evt) => {
	        if (evt instanceof NavigationEnd) {
	           this.router.navigated = false;
	           window.scrollTo(0, 0);
	        }
	    });
	}

	ngOnInit() {
		this.MycardDatabase = new MycardspyHttpDao(this.http, this.apiService);
		this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
		this.actionbk();
	}

	ConvertToInt(val){
		return parseInt(val);
	}

	ngOnchanges(){
		console.log('sdf');
	}

	actionbk(search:string=''){
		if (search != '' && typeof search != 'undefined') {
			merge()
			.pipe(
				startWith({}),
				switchMap(() => {
					this.isLoadingResults = true;
					return this.MycardDatabase!.getPyapi(
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
					return this.MycardDatabase!.getPyapi(
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

	setPrimarycard(id:number){
		this.apiService.getRequest(constant.apiurl + constant.set_primary_card+'?id='+id).subscribe(
	        data => {
	        this.billing_result = data;
			this.usersService.snackMessage("Primary card setting updated successfully.");
			this.actionbk();
	      }, err => {
	        console.log(err);
	    });
	}

	deleteMethod(id:number){

		this.id = id;
		const dialogRef = this.dialog.open(DeleteBillingMethodComponent, {
			data: {billing_id: id}
		});

		dialogRef.afterClosed().subscribe(result => {
			this.actionbk();
		});
	}


}

export interface MycardsApi {
	results: MycardlistData[];
	count: number;
}

export interface MycardlistData {
	id: any;
	brand:string;
	last: string;
	country: string;
}


export class MycardspyHttpDao {
	constructor(private http: HttpClient, private apiService: ApiService) {}
	public get authHeader(): string {
		return `JWT ${localStorage.getItem('exp_token')}`;
	}
	setHeaders() {
		return {
			headers: new HttpHeaders().set('Authorization', this.authHeader)
		};
	}
	getPyapi(sort: string, order: string, page: number, filter: string=''): Observable<MycardsApi> {
		const href = constant.apiurl + constant.save_stripe;
		const requestUrl =
		`${href}?user=`+this.apiService.decodejwts().userid+`&page=${page + 1}`;
		return this.http.get<MycardsApi>(requestUrl, this.setHeaders());
	}
}