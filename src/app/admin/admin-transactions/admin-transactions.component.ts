/*
 * Page : Admin Transaction listing
 * Use: This page only used to submit the strip and paypal information
 * Functionality :
 *  >> Create the angular material table
 *  >> Fetch the data's from APIs
 *  >> Added the filter & pagination option
 * Created Date : 05/01/2019
 * Updated Date : 09/01/2019
 * Copyright : Bsetec
 */
 import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef, ElementRef, Inject } from '@angular/core';
 import { HttpHeaders, HttpResponse, HttpXsrfTokenExtractor, HttpClient } from '@angular/common/http';
 import { MatSnackBar, MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSortable, MatDialogRef, MAT_DIALOG_DATA, MatIcon, PageEvent } from '@angular/material';
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
 import jsPDF from 'jspdf';
 import * as $ from 'jquery';

 @Component({
 	selector: 'app-admin-transactions',
 	templateUrl: './admin-transactions.component.html',
 	styleUrls: ['./admin-transactions.component.css']
 })
 export class AdminTransactionsComponent implements OnInit {
 	// This (displayedColumns) variable used to declare the martial table column values
 	displayedColumns = ['index', 'created', 'type', 'last_name', 'contract_name', 'membership_name', 'amount', 'action'];
 	JobsDatabase: TransactionpyHttpDao | null;
 	data: TransactionlistData[] = [];
 	dataSource = new MatTableDataSource<TransactionlistData>();
 	customFilter:string;
 	resultsLength = 0;
 	isLoadingResults = true;
 	isRateLimitReached = false;
 	pageEvent: PageEvent;
	perpage = constant.itemsPerPage;
	selectTransactions:any;
 	id: number;
 	@ViewChild(MatPaginator) paginator: MatPaginator;
 	@ViewChild(MatSort) sort: MatSort;
 	@ViewChild('filter') filter: ElementRef;

 	constructor(private http: HttpClient,  public dialog: MatDialog, public snackBar: MatSnackBar,) {}

 	ngOnInit() {
 		this.JobsDatabase = new TransactionpyHttpDao(this.http);
 		this.sort.sort(<MatSortable>{
 			id: 'id',
 			start: 'desc'
 		});
 		this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
 		this.actionbk(); // This function call for initial table value display option
 	}

 	ConvertToInt(val){
 		return parseInt(val);
 	}
 	/** This function is used for get data's from API and display to the material table */
 	actionbk(search:string=''){
 		if (search != '' && typeof search != 'undefined') {
 			merge(this.sort.sortChange, this.paginator.page)
 			.pipe(
 				startWith({}),
 				switchMap(() => {
 					this.isLoadingResults = true; // Before data fetching display the loader image
 					return this.JobsDatabase!.getPyapi(
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
 					return this.JobsDatabase!.getPyapi(
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

 	/** This function is used for search text based user list display in material table */
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
	 
openTransactionModal(templateRef: any, element: any) {
	this.selectTransactions = element;
	// console.log(this.selectTransactions)
    let dialogRef = this.dialog.open(templateRef, {
      width: '250px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
	}
	
	downloadinvoice(contractName) {
		var doc = new jsPDF();

		var specialElementHandlers = {
			'.transaction-details': function(element, renderer){
					return true;
			}
	};
	
	doc.fromHTML($('.transaction-details').get(0), 15, 15, {
			'width': 170,
			'elementHandlers': specialElementHandlers
	});
		doc.save(contractName + '.pdf');
	}

 }

 export interface TransactionApi {
 	results: TransactionlistData[];
 	count: number;
 }
 /** Assign the API response data to the 'TransactionlistData' array value */
 export interface TransactionlistData {
 	id: any;
 	created: string;
 	type: string;
 	last_name: string;
 	amount: any;
 	membership_name: string;
 	contract_name:string;
 }

 

 export class TransactionpyHttpDao {
 	constructor(private http: HttpClient) {}
 	public get authHeader(): string {
 		return `JWT ${localStorage.getItem('exp_token')}`;
 	}
 	setHeaders() {
 		return {
 			headers: new HttpHeaders().set('Authorization', this.authHeader)
 		};
 	}
 	/** This functioan is used get the API data's from backend */

 	// getPyapi(): Observable<TransactionApi> {
	// 	//  const href = constant.apiurl + constant.admintransactions;
	// 	 const href = constant.apiurl + constant.admin_transaction_history;

 	// 	// const requestUrl = `${href}?search=${filter}&sort=${sort}&order=${order}&page=${page + 1}`;
	// 	//  return this.http.get<TransactionApi>(href, this.setHeaders());
	// 	return this.http.get<any>(href, this.setHeaders());
	//  }
	 getPyapi(sort: string, order: string, page: number, filter: string=''): Observable<TransactionApi> {
		 const href = constant.apiurl + constant.admintransactions;

 		const requestUrl = `${href}?search=${filter}&sort=${sort}&order=${order}&page=${page + 1}`;
		 return this.http.get<TransactionApi>(requestUrl, this.setHeaders());
 	}
 }
