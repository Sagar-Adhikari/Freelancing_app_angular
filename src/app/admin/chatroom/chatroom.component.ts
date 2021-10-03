import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef, ElementRef, HostListener, Inject } from '@angular/core';
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
import { ChatService } from '../../services/chat/chat.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css']
})
export class ChatroomComponent implements OnInit {
  displayedColumns = ['index', 'room_name', 'created', 'action'];
  TestyDatabase: MessagepyHttpDao | null;
  data: MsglistData[] = [];
  dataSource = new MatTableDataSource<MsglistData>();
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  pageEvent: PageEvent;
  id: number;
  recent_results:any;
  recent_room_list = [];
  user_id = this.apiService.decodejwts().userid;
  perpage = constant.itemsPerPage;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private http: HttpClient,  public dialog: MatDialog, public snackBar: MatSnackBar, private apiService: ApiService, private router:Router) { }

  ngOnInit() {
  	this.TestyDatabase = new MessagepyHttpDao(this.http, this.apiService);
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.actionbk();
  }

  ConvertToInt(val){
    return parseInt(val);
  }

  paginationhidder:boolean;
  actionbk(search:string=''){
      merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.TestyDatabase!.getPyapi(
            this.sort.active, this.sort.direction, this.paginator.pageIndex);
        }),
        map(data => {
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.count;
          if(this.resultsLength > 10){
            this.paginationhidder = true;
          }else{
            this.paginationhidder = false;
          }
          return data.results;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.isRateLimitReached = true;
          return observableOf([]);
        })
        ).subscribe(data =>{
          this.data = data;
        });
  }

}


export interface MessageApi {
  results: MsglistData[];
  count: number;
}

export interface MsglistData {
  id: any;
  user: any;
  room_name: string;
  created: string;
}


export class MessagepyHttpDao {
  constructor(private http: HttpClient, private apiService: ApiService) {}
  public get authHeader(): string {
    return `JWT ${localStorage.getItem('exp_token')}`;
  }
  setHeaders() {
    return {
      headers: new HttpHeaders().set('Authorization', this.authHeader)
    };
  }
  getPyapi(sort: string, order: string, page: number): Observable<MessageApi> {

    const href = constant.apiurl + constant.roomlisting;
    const requestUrl =
    `${href}?sort=${sort}&order=${order}&page=${page + 1}`;
    return this.http.get<MessageApi>(requestUrl, this.setHeaders());
  }
}