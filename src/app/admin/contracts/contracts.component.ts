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
import { constant } from '../../../data/constant';
import { ApiService } from '../../services/api/api.service';
import { Title, Meta, DOCUMENT } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from './../../../environments/environment';
import { DeletionComponent } from '../dialogs/deletion/deletion.component';
import { EmailValidator } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'app-contracts',
	templateUrl: './contracts.component.html',
	styleUrls: ['./contracts.component.css']
})
export class ContractsComponent implements OnInit {

	displayedColumns = ['index', 'client', 'freelancer', 'job_category', 'job_subcategory', 'title', 'amount', 'status', 'created', 'action'];
	JobsDatabase: TestpyHttpDao | null;
	data: TestlistData[] = [];
	dataSource = new MatTableDataSource<TestlistData>();
	customFilter: string;
	resultsLength = 0;
	isLoadingResults = true;
	isRateLimitReached = false;
	pageEvent: PageEvent;
	id: number;
	perpage = constant.itemsPerPage;
	categoryFilter: any = '';
	subcategoryFilter: any = '';
	statusFilter: any = '';
	paymentType: any = '';
	catTemp; any = []; subcatTemp: any = [];
	categoryList: any = [];
	subcategoryList: any = [];
	displayRange = false;
	dateTypeSelection: any = '';
	fromDate = '';
	toDate =  '';

	paymentLists = [
		{ name: 'Fixed', value: 'Fixed' },
		{ name: 'Hourly', value: 'Hourly' }
	];
	statusLists = [
		{ name: 'Open', value: 'Open' },
		{ name: 'Closed', value: 'Closed' },
		{ name: 'Completed', value: 'Completed' }
	];
	types: any = [
		{ value: '1', viewValue: 'Today' },
		{ value: '2', viewValue: 'Yesterday' },
		{ value: '3', viewValue: 'Last 7 Days' },
		{ value: '4', viewValue: 'Last 30 Days' },
		{ value: '5', viewValue: 'This Month' },
		{ value: '6', viewValue: 'Last Month' },
		{ value: '7', viewValue: 'Custom Range' }
	];
	public options: any = {
		locale: { format: 'YYYY-MM-DD' },
		alwaysShowCalendars: false
	};
	public daterange: any = {};

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('filter') filter: ElementRef;

	constructor(private api: ApiService, private http: HttpClient, public dialog: MatDialog, public snackBar: MatSnackBar, private datePipe: DatePipe) { }

	ngOnInit() {
		this.JobsDatabase = new TestpyHttpDao(this.http);
		this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
		this.actionbk();
		this.getCategorynames();
		this.fromDate = this.datePipe.transform(new Date, 'yyyy-MM-dd');
		this.toDate = this.datePipe.transform(new Date, 'yyyy-MM-dd');
	}

	getCategorynames() {
		var href = constant.apiurl + constant.job_category_all;
		var params = '';
		this.api.getRequest(href + '?' + params).subscribe(
			data => {
				this.catTemp = data;
				this.catTemp.body.forEach(item => { if (item.status == 'Active') { this.categoryList.push(item); } });
			});
	}
	changeCategory(categoryId) {
		if (categoryId) {
			this.api.getRequest(constant.apiurl + constant.admincategorylist + '/' + categoryId)
				.subscribe(responseData => {
					this.subcatTemp = responseData['body'];
					this.subcategoryList = this.subcatTemp.subcategory;
					this.subcategoryFilter = '';
				});
		}
	}

	onChangeType(objType) {
		this.displayRange = false;
		if (objType === '7') {
			this.displayRange = true;
			return false;
		}
	}

	public selectedDate(value: any, datepicker?: any) {
		// Any object can be passed to the selected event and it will be passed back here
		this.daterange.start = value.start;
    	this.daterange.end = value.end;
		console.log(this.daterange.start.format('YYYY-MM-DD'));
		this.fromDate = this.daterange.start.format('YYYY-MM-DD');
		this.toDate = this.daterange.end.format('YYYY-MM-DD');
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
							this.sort.active, this.sort.direction, this.paginator.pageIndex, search, this.categoryFilter, this.subcategoryFilter, this.paymentType, this.statusFilter, this.dateTypeSelection, this.fromDate, this.toDate, this.customFilter);
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
							this.sort.active, this.sort.direction, this.paginator.pageIndex, this.dataSource.filter, this.categoryFilter, this.subcategoryFilter, this.paymentType, this.statusFilter, this.dateTypeSelection, this.fromDate, this.toDate, this.customFilter);
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
			this.dataSource.filter = '';
			this.filter.nativeElement.value = '';
			this.paymentType = '';
			this.statusFilter = '';
			this.categoryFilter = '';
			this.subcategoryList = [];
			this.customFilter = '';
			this.subcategoryFilter = '';
			this.dateTypeSelection = '';
			this.displayRange = false;
			this.actionbk();
		} else {
			if (filterValue != '' && typeof filterValue != 'undefined') {
				this.dataSource.filter = filterValue;
				filterValue = filterValue.toLowerCase();
			} else {
				filterValue = '';
			}
			this.paginator.pageIndex = 0;
			if (this.pageEvent) {
				this.pageEvent.pageIndex = 0;
			}
			this.actionbk(filterValue.toLowerCase());
		}
	}

	deletebyid(id: number) {
		this.id = id;
		const dialogRef = this.dialog.open(DeletionComponent, {
			data: { id: id, from: 'testimonials' }
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result === 1) {
				this.dataSource.filter = this.filter.nativeElement.value;
				this.actionbk(this.dataSource.filter);
				this.snackBar.open('Record deleted successfully.');
				setTimeout(() => {
					this.snackBar.dismiss();
				}, 1500);
			}
		});
	}
}

export interface TestApi {
	results: TestlistData[];
	count: number;
}

export interface TestlistData {
	id: any;
	job_category: string;
	job_subcategory: string;
	title: string;
	amount: string;
	type: string;
	client: any;
	freelancer: any;
	status: string;
	created: any;
}


export class TestpyHttpDao {
	constructor(private http: HttpClient) { }
	public get authHeader(): string {
		return `JWT ${localStorage.getItem('exp_token')}`;
	}
	setHeaders() {
		return {
			headers: new HttpHeaders().set('Authorization', this.authHeader)
		};
	}
	getPyapi(sort: string, order: string, page: number, filter: string = '', catFilter = '', subcatFilter = '', type = '', status = '', custom = '', from_date = '', to_date = '', customFilter = ''): Observable<TestApi> {
		const href = constant.apiurl + constant.admincontractlist;
		let requestUrl =
			`${href}?search=${customFilter}&sort=${sort}&order=${order}&page=${page + 1}`;
		if (catFilter != "") {
			requestUrl = requestUrl + '&job_category_id=' + catFilter;
		}
		if (subcatFilter != "") {
			requestUrl = requestUrl + '&job_subcategory_id=' + subcatFilter;
		}
		if (type != '') {
			requestUrl = requestUrl + '&type=' + type;
		}
		if (status != '') {
			requestUrl = requestUrl + '&status=' + status;
		}
		if (custom != '') {
			requestUrl = requestUrl + '&custom=' + custom + '&from_date=' + from_date + '&to_date=' + to_date;
		}
		return this.http.get<TestApi>(requestUrl, this.setHeaders());
	}
}
