import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef, ElementRef, Inject } from '@angular/core';
import { ApiService } from '../../services/api/api.service';
import { UserService } from '../../services/sync/user.service';
import { constant } from '../../../data/constant';
import { Router } from '@angular/router';
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
import { WithdrawSettlementComponent } from './withdraw-settlement/withdraw-settlement.component';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.css']
})
export class WithdrawComponent implements OnInit {

  displayedColumns = ['index', 'created', 'name', 'type', 'amount',  'service_fee', 'settlement_amount', 'settlement_date', 'settlement_notes', 'status', 'action'];
	MywithdrawDatabase: MywithdrawpyHttpDao | null;
	data: MywithdrawlistData[] = [];
	dataSource = new MatTableDataSource<MywithdrawlistData>();
	resultsLength = 0;
	isLoadingResults = true;
	isRateLimitReached = false;
	pageEvent: PageEvent;
	id: number;
	loggedUserId: any;
	mywithdrawpaginatorhide;
	perpage = constant.itemsPerPage;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	PopupDialogRef2: MatDialogRef<WithdrawSettlementComponent>;

  constructor(
  	private http: HttpClient,
  	private userService: UserService,
	private apiService: ApiService,
	private dialogWithdraw: MatDialog,
	private router: Router
  ) { }

  ngOnInit() {
  	this.loggedUserId = this.apiService.decodejwts().userid;
  	this.MywithdrawDatabase = new MywithdrawpyHttpDao(this.http, this.apiService);
	this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
	this.actionbk();
  }

  ConvertToInt(val){
  	return parseInt(val);
  }

  withdrawBank(id, amount, user, type) {
    this.PopupDialogRef2 = this.dialogWithdraw.open(WithdrawSettlementComponent, {
      disableClose: true,
      data: { 
      	'user_id': this.loggedUserId,
      	'withdraw_id': id,
      	'amount': amount,
      	'freelancer': user,
      	'type': type
       }
    });

    this.PopupDialogRef2.afterClosed().subscribe(result => {
      if(result == 'success'){
        this.router.navigate(['/admin/dashboard']);
      }
    });
  }

  actionbk(search:string=''){
	merge(this.sort.sortChange, this.paginator.page)
	.pipe(
		startWith({}),
		switchMap(() => {
			this.isLoadingResults = true;
			return this.MywithdrawDatabase!.getPyapi(
				this.sort.active, this.sort.direction, this.paginator.pageIndex);
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
		).subscribe(data => {
			if (this.resultsLength > 10){
				this.mywithdrawpaginatorhide = true;
			} else {
				this.mywithdrawpaginatorhide = false;
			}
			this.data = data;
		});
	}

}


export interface MywithdrawApi {
	results: MywithdrawlistData[];
	count: number;
}

export interface MywithdrawlistData {
	id: any;
	created: string;
	name: string;
	type: string;
	amount: string;
	service_fee: string;
	settlement_amount: string;
	status: string;
	modified: string;
	sattlement_date: string;
	settlement_notes: string;
}


export class MywithdrawpyHttpDao {
	constructor(private http: HttpClient, private apiService: ApiService) {}
	public get authHeader(): string {
		return `JWT ${localStorage.getItem('exp_token')}`;
	}
	setHeaders() {
		return {
			headers: new HttpHeaders().set('Authorization', this.authHeader)
		};
	}
	getPyapi(sort: string, order: string, page: number): Observable<MywithdrawApi> {
		const href = constant.apiurl + constant.getWithdrawRequest;
		const requestUrl =
		`${href}?&page=${page + 1}`;
		return this.http.get<MywithdrawApi>(requestUrl, this.setHeaders());
	}
}