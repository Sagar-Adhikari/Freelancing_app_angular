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
import { constant } from '../../../../../data/constant';
import { ApiService } from '../../../../services/api/api.service';
import { Title, Meta, DOCUMENT } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
// import { BillingMethodComponent } from './../../billing-method/billing-method.component';
import { AddManualTimeComponent } from './../../add-manual-time/add-manual-time.component';

@Component({
	selector: 'app-my-contract',
	templateUrl: './my-contract.component.html',
	styleUrls: ['./my-contract.component.css']
})

export class MyContractComponent implements OnInit {

	displayedColumns = ['index', 'job_category', 'job_subcategory', 'title',  'amount', 'action'];
	MycontractDatabase: MycontractpyHttpDao | null;
	data: MycontractlistData[] = [];
	dataSource = new MatTableDataSource<MycontractlistData>();
	customFilter:string;
	resultsLength = 0;
	isLoadingResults = true;
	isRateLimitReached = false;
	pageEvent: PageEvent;
	id: number;
	mycontractpaginatorhide;
	perpage = constant.itemsPerPage;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('filter') filter: ElementRef;

	constructor(private http: HttpClient,  public dialog: MatDialog, public snackBar: MatSnackBar, private apiService: ApiService) {}

	ngOnInit() {
		this.MycontractDatabase = new MycontractpyHttpDao(this.http, this.apiService);
		this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
		this.actionbk();
	}

	ConvertToInt(val){
		return parseInt(val);
	}
	
	actionbk(search:string=''){
		if (search != '' && typeof search != 'undefined') {
			merge()
			.pipe(
				startWith({}),
				switchMap(() => {
					this.isLoadingResults = true;
					return this.MycontractDatabase!.getPyapi(
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
				).subscribe(data =>{
					if (data.length > 10){
						this.mycontractpaginatorhide = false;
					} else {
						this.mycontractpaginatorhide = true;
					}
					this.data = data;
				});
		}else{
			merge(this.sort.sortChange, this.paginator.page)
			.pipe(
				startWith({}),
				switchMap(() => {
					this.isLoadingResults = true;
					return this.MycontractDatabase!.getPyapi(
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
				).subscribe(data =>{
					if(data.length > 10){
						this.mycontractpaginatorhide = true;
					}else{
						this.mycontractpaginatorhide = false;
					}
					this.data = data;
				});
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

	billingPopup(id:any){

		// const dialogChoosebilling = this.dialog.open(BillingMethodComponent, {
		// 	disableClose: true,
		// 	data: {'type':3, 'contract_id':id}
		// });

		// dialogChoosebilling.afterClosed().subscribe(result => {
		// 	if(result!='cancel'){
		// 		// this.router.navigate(['contract/'+this.freelancer_id]);
		// 		// this.formControlValueChanged();  
		// 	}
		// });
	}

	manualtimePopup(id:any){

		const dialogChoosebilling = this.dialog.open(AddManualTimeComponent, {
			disableClose: true,
			data: {'contract_id':id}
		});

		dialogChoosebilling.afterClosed().subscribe(result => {
			if(result!='cancel'){
			}
		});
	}
}

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
		`${href}?client=`+this.apiService.decodejwts().userid+`&search=`+filter+`&page=${page + 1}`;
		return this.http.get<MycontractApi>(requestUrl, this.setHeaders());
	}
}
