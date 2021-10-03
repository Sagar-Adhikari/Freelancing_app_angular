import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent, MatDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { merge } from 'rxjs/observable/merge';
import { of as observableOf } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';
import { startWith } from 'rxjs/operators/startWith';
import { switchMap } from 'rxjs/operators/switchMap';
import * as moment from 'moment';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { ApiService } from '../../../services/api/api.service';
import { UserService } from '../../../services/sync/user.service';
import { constant, inputData } from '../../../../data/constant';
@Component({
  selector: 'app-cl-transactions',
  templateUrl: './cl-transactions.component.html',
  styleUrls: ['./cl-transactions.component.css']
})
export class ClTransactionsComponent implements OnInit {
 loggedUserId: any;
  selectedDateRange: any;
  clientFilter: any = '';
  transactionFilter: any = '';
  relatedClients: any = [];
  transactionTypes: any = inputData.transactionType;
  displayedColumns: string[] = ['date', 'type', 'description', 'freelancer', 'amount', 'ref_id'];
  transactionDatabase: TransactionHistoryspyHttpDao | null;
  data: TransactionhistorylistData[] = [];
  dataSource = new MatTableDataSource<TransactionhistorylistData>();
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  pageEvent: PageEvent;
  perpage = constant.itemsPerPage;
  fromDate: any = '';
  toDate: any = '';
  displayfromDate: any = '';
  displaytoDate: any = '';
  balance: any = 0;
  beginning_balance: any = 0;
  total_credits: any = 0;
  total_debits: any = 0;
  escrow: any = 0;
  dispute: any = 0;
  selectTransactions: any;
  Paginatorhidder: boolean;
  resDataTranaction: any = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;
  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private userService: UserService,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.loggedUserId = this.apiService.decodejwts().userid;
    this.toDate = moment().format("YYYY-MM-DD");
    this.fromDate = moment().subtract('months', 1).format("YYYY-MM-DD");
    this.dateDisplayFormat();
    this.getRelatedClients();
    this.transactionDatabase = new TransactionHistoryspyHttpDao(this.http);
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.actionbk();
  }
  dateDisplayFormat() {
    this.displaytoDate = moment(this.toDate).format("MMM DD, YYYY");
    this.displayfromDate = moment(this.fromDate).format("MMM DD, YYYY");
    this.selectedDateRange = { start: this.displayfromDate, end: this.displaytoDate };
  }
  changeDateRange(event: any) {
    
    if(event.start == undefined){
      //this.toDate = moment(event['selectedDateRange.end']._d).format("YYYY-MM-DD");
     // this.fromDate = moment(event['selectedDateRange.start']._d).format("YYYY-MM-DD");
      this.dateDisplayFormat();
      this.actionbk();
    }
    if (event.start && event.end) {
      this.toDate = moment(event.end).format("YYYY-MM-DD");
      this.fromDate = moment(event.start).format("YYYY-MM-DD");
      this.dateDisplayFormat();
      this.actionbk();
    }
  }
  actionbk() {
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.transactionDatabase!.getPyapi(this.paginator.pageIndex, this.fromDate, this.toDate, this.transactionFilter, this.clientFilter);
        }),
        map(data => {
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resDataTranaction = data;
          this.resultsLength = this.resDataTranaction.transaction_count;
          if (this.resultsLength > 10) {
            this.Paginatorhidder = true;
          } else {
            this.Paginatorhidder = false;
          }
          this.dataSource.data = this.resDataTranaction.transaction_list;
          this.balance = (this.resDataTranaction.balance) ? this.resDataTranaction.balance : 0;
          this.beginning_balance = (this.resDataTranaction.beginning_balance) ? this.resDataTranaction.beginning_balance : 0;
          this.total_credits = (this.resDataTranaction.total_credits) ? this.resDataTranaction.total_credits : 0;
          this.total_debits = (this.resDataTranaction.total_debits) ? this.resDataTranaction.total_debits : 0;
          this.escrow = (this.resDataTranaction.escrow) ? this.resDataTranaction.escrow : 0;
          this.dispute = (this.resDataTranaction.dispute) ? this.resDataTranaction.dispute : 0;
          if (this.resDataTranaction.transaction_list.length === 0) {
            if (this.paginator.hasPreviousPage()) {
              this.paginator.previousPage();
            }
            return this.resDataTranaction.transaction_list;
          } else {
            return this.resDataTranaction.transaction_list;
          }
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe(data => this.data = data);
  }
  getRelatedClients() {
    this.apiService.getRequest(constant.apiurl + constant.related_clients + '?client=' + this.loggedUserId).subscribe(
      data => {
        if (data['status'] === 200 && data['ok'] === true) {
          this.relatedClients = data['body'];
          console.log(this.relatedClients);
        }
      }, err => {
        console.log(err);
      });
  }
  applyFilter(empty: number) {
    if (empty == 0) {
      this.toDate = moment().format("YYYY-MM-DD");
      this.fromDate = moment().subtract('months', 1).format("YYYY-MM-DD");
      this.transactionFilter = "";
      this.clientFilter = "";
      this.dateDisplayFormat();
      this.actionbk();
    } else {
      this.paginator.pageIndex = 0;
      if (this.pageEvent) {
        this.pageEvent.pageIndex = 0;
      }
      this.dateDisplayFormat();
      this.actionbk();
    }
  }
  openTransactionModal(templateRef: any, element: any) {
    this.selectTransactions = element;
    let dialogRef = this.dialog.open(templateRef, {
      width: '250px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
export interface TransactionHistoryApi {
  transaction_list: TransactionhistorylistData[];
  transaction_count: number;
  total_credits: number;
  total_debits: number;
  beginning_balance: number;
  balance: any;
  escrow:number;
  dispute:number
}

export interface TransactionhistorylistData {
  created: any;
  type: any;
  description: string;
  client: any;
  freelancer_name: any;
  amount: any;
  balance: any;
  ref_id: any;
}
export class TransactionHistoryspyHttpDao {
  constructor(private http: HttpClient) { }
  public get authHeader(): string {
    return `JWT ${localStorage.getItem('exp_token')}`;
  }
  setHeaders() {
    return {
      headers: new HttpHeaders().set('Authorization', this.authHeader)
    };
  }
  getPyapi(page: number, from_date: string = '', to_date: string = '', transaction: string = '', client: string = ''): Observable<TransactionHistoryApi> {
    if(transaction == 'Credit'){
      transaction = 'Debit';
    }else if(transaction == 'Debit'){
      transaction = 'Credit';
    }
    const href = constant.apiurl + constant.client_transaction_history;
    let requestUrl = `${href}?from_date=${from_date}&to_date=${to_date}&transaction=${transaction}&client=${client}&page=${page + 1}`;
    return this.http.get<TransactionHistoryApi>(requestUrl, this.setHeaders());
  }
}