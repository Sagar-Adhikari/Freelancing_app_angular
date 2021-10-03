import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef, ElementRef, Inject } from '@angular/core';
import { ApiService } from '../../../../services/api/api.service';
import { constant } from '../../../../../data/constant';
import { UserService } from '../../../../services/sync/user.service';
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
import { WithdrawMethodComponent } from './withdraw-method/withdraw-method.component';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.css']
})
export class WithdrawComponent implements OnInit {
  	displayedColumns = ['index', 'created', 'type', 'amount',  'service_fee', 'settlement_amount', 'settlement_date', 'settlement_notes', 'status'];
	MywithdrawDatabase: MywithdrawpyHttpDao | null;
	data: MywithdrawlistData[] = [];
	dataSource = new MatTableDataSource<MywithdrawlistData>();
	resultsLength = 0;
	isLoadingResults = true;
	isRateLimitReached = false;
	pageEvent: PageEvent;
	id: number;
	freelancer_amount: any;
	paypal_fee: any;
	bank_fee: any;
	loggedUserId: any;
	PopupDialogRef2: MatDialogRef<WithdrawMethodComponent>;
	mywithdrawpaginatorhide;
	mywithdrawrequesthide;
	perpage = constant.itemsPerPage;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	initialDocumentData: any;
  	initialDocData: any;
  	initialSettingData: any;
  	initialSetData: any;

  constructor(
  	private http: HttpClient,
  	private userService: UserService,
	private apiService: ApiService,
	private dialogWithdraw: MatDialog,
	private router: Router
  ) { }

  ngOnInit() {
  	this.MywithdrawDatabase = new MywithdrawpyHttpDao(this.http, this.apiService);
	this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
	this.actionbk();
    this.loggedUserId = this.apiService.decodejwts().userid;
    this.getFreelancerBalance();
  }

  getFreelancerBalance() {
    this.apiService.getRequest(constant.apiurl + constant.getBalance + '?id='+this.loggedUserId).subscribe(
      data => {
        this.freelancer_amount = '';
        this.initialDocumentData = data;
        if (this.initialDocumentData.status === 200) {
          this.initialDocData = this.initialDocumentData.body;
          if(this.initialDocData.amount > 0){
          	this.freelancer_amount = this.initialDocData.amount;
          	this.mywithdrawrequesthide = true;
          }else{
          	this.freelancer_amount = 0;
          	this.mywithdrawrequesthide = false;
          }
        }
      }, err => {
        console.log(err);
      });


	 this.apiService.getRequest(constant.apiurl + constant.adminSettingsOptions).subscribe(
	  data => {
	    this.paypal_fee = '';
	    this.bank_fee = '';
	    this.initialSettingData = data;
	    if (this.initialSettingData.status === 200) {
	      this.initialSetData = this.initialSettingData.body;
	      this.paypal_fee = this.initialSetData.options.withdraw_fee_paypal;
	      this.bank_fee = this.initialSetData.options.withdraw_fee_bank;
	    }
	  }, err => {
	    console.log(err);
	  });
  }

  ConvertToInt(val){
  	return parseInt(val);
  }

  goback(){
  	window.history.back();
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
		).subscribe(data =>{
			if (this.resultsLength > 10) {
				this.mywithdrawpaginatorhide = true;
			}else{
				this.mywithdrawpaginatorhide = false;
			}
			this.data = data;
		});
	}
  

  withdrawPopup() {
    this.PopupDialogRef2 = this.dialogWithdraw.open(WithdrawMethodComponent, {
      disableClose: true,
      data: { 
      'user_id': this.loggedUserId,
      'freelancer_amount': this.freelancer_amount,
      'paypal_fee': this.paypal_fee,
      'bank_fee': this.bank_fee
       }
    });

    this.PopupDialogRef2.afterClosed().subscribe(result => {
      if(result == 'success'){
        this.userService.snackMessage('Withdraw request has been added successfully.');
        this.router.navigate(['setting/withdraw-request']);
      }
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
	type: string;
	amount: string;
	service_fee: string;
	settlement_amount: string;
	settlement_date: string;
	settlement_notes: string;
	status: string;
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
		`${href}?user=`+this.apiService.decodejwts().userid+`&page=${page + 1}`;
		return this.http.get<MywithdrawApi>(requestUrl, this.setHeaders());
	}
}