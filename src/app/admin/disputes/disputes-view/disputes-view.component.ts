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
import { Title, Meta, DOCUMENT } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { constant } from './../../../../data/constant';
import { ApiService } from '../../../services/api/api.service';
@Component({
  selector: 'app-disputes-view',
  templateUrl: './disputes-view.component.html',
  styleUrls: ['./disputes-view.component.css']
})
export class DisputesViewComponent implements OnInit {

  displayedColumns = ['index','date', 'user_name','chat_message'];
  data: DisputeslistData[] = [];
  dataSource = new MatTableDataSource<DisputeslistData>();
  resultsLength:number;
  JobsDatabase: DisputespyHttpDao | null;
  isLoadingResults = true;
  isRateLimitReached = false;
  contractId = this.activeRoute.snapshot.params;
  disputeDetailArr:any;
  dialogRef:any;

  pageEvent:PageEvent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;

  constructor(private api:ApiService,private http: HttpClient,  public dialog: MatDialog, public snackBar: MatSnackBar,private activeRoute: ActivatedRoute ) { }

  ngOnInit() {
    this.JobsDatabase = new DisputespyHttpDao(this.http);
    this.sort.sort(<MatSortable>{
      id: 'id',
      start: 'desc'
    });
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.actionbk();
    this.getDisputesDetails();
  }

  actionbk(search:string=''){
    if (search != '' && typeof search != 'undefined') {
      merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true; // Before data fetching display the loader image
          return this.JobsDatabase!.getPyapi(
            this.sort.active, this.sort.direction, this.paginator.pageIndex, search,this.contractId.id);
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
            this.sort.active, this.sort.direction, this.paginator.pageIndex, this.dataSource.filter,this.contractId.id);
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

  ConvertToInt(val){
    return parseInt(val);
  }

  sendMessege(event){
    if(event == ''){
      this.snackBar.open('Please enter the messege', '', {
        duration: 3000,
      });
      return false;
    }
    let data = {'chat_message':event,'contract_id':this.contractId.id};
    this.api.postRequest(constant.apiurl + constant.getDisputeMessage +'?contract_id='+ this.contractId.id ,data).subscribe(data => {
      this.snackBar.open('success', '', {
        duration: 3000,
      });
      event = '';
      this.actionbk();
      this.dialogRef.close();
      },error => console.log(error))
  }
  suggesstionfunc(suggested,msg){

    let favor:number;
    if(suggested == 'client'){
      favor = 1;
    }else if(suggested == 'freelancer'){
      favor = 2;
    }else{
      console.log('Not allowed')
      return false;
    }
    let params = {
      'contract_id': this.contractId.id,
      'close_message': msg,
      'type': favor
    };
    this.api.postRequest(constant.apiurl + constant.closeDispute, params ).subscribe(
      data => {
          this.snackBar.open('success', '', {
            duration: 3000,
          });
          this.getDisputesDetails();
          this.actionbk();
          this.dialogRef.close();
      }, err => {
        console.log(err);
    });
   
  }
  getDisputesDetails(){

    this.api.getRequest(constant.apiurl + constant.disputes_details + this.contractId.id).subscribe(
      data => {
        if (data['status'] === 200 && data['ok'] === true) {
          this.disputeDetailArr = data['body'];
        }
      }, err => {
        console.log(err);
      });
  }

  goback(){
    window.history.back();
  }
  closePopup(templateRef: any){
    this.dialogRef = this.dialog.open(templateRef, {
      width: '250px',
    });
    this.dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      console.log(result)
      // dialogRef.close();
    });
  }
  
  messegePopup(templateRef: any){
    this.dialogRef = this.dialog.open(templateRef, {
      width: '250px',
    });
    this.dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      console.log(result)
      // dialogRef.close();
    });
  }
}


export interface DisputesApi {
  results: DisputeslistData[];
  count: number;
}
/** Assign the API response data to the 'DisputeslistData' array value */
export interface DisputeslistData {
  id: any;
  created: string;
  type: string;
  last_name: string;
  amount: any;
  membership_name: string;
  contract_name:string;
}



export class DisputespyHttpDao {
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

  getPyapi(sort: string, order: string, page: number, filter: string='',contract:string=''): Observable<DisputesApi> {
    const href = constant.apiurl + constant.getDisputeMessage;

    const requestUrl = `${href}?search=${filter}&sort=${sort}&contract_id=${contract}&order=${order}&page=${page + 1}`;
    return this.http.get<DisputesApi>(requestUrl, this.setHeaders());
  }
}