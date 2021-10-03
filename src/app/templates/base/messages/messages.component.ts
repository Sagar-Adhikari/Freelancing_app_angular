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
import { constant } from '../../../../data/constant';
import { ApiService } from '../../../services/api/api.service';
import { Title, Meta, DOCUMENT } from '@angular/platform-browser';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ChatService } from '../../../services/chat/chat.service';
import { EditRoomComponent } from './../messages/edit-room/edit-room.component';
import * as moment from 'moment';
import { SidebarComponent } from './../messages/sidebar/sidebar.component';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  displayedColumns = ['index', 'room_name', 'created', 'action'];
  TestyDatabase: MessagepyHttpDao | null;
  data: MsglistData[] = [];
  dataSource = new MatTableDataSource<MsglistData>();
  customFilter:string;
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
  @ViewChild('filter') filter: ElementRef;

  constructor(private http: HttpClient,  public dialog: MatDialog, public snackBar: MatSnackBar, private apiService: ApiService, private router:Router) {}

  ngOnInit() {
    this.getrecentinfo();
    this.TestyDatabase = new MessagepyHttpDao(this.http, this.apiService);
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.actionbk();
    this.router.routeReuseStrategy.shouldReuseRoute = function(){
        return false;
     }
     this.router.events.subscribe((evt) => {
        if (evt instanceof NavigationEnd) {
           this.router.navigated = false;
           window.scrollTo(0, 0);
        }
    });
  }

  getrecentinfo(){
    var api_url = constant.apiurl + constant.roomrecent+'?email='+this.apiService.decodejwts().email+'&days=30';   
    this.apiService.getRequest(api_url).subscribe(result => {
      this.recent_results = result;
    },error => {
      console.log('something went wrong');
    },() => {
      this.recent_results.body.map(item  => {
        item.new_date_format = moment(item.modified, "YYYYMMDD h:m:s").fromNow();
        return item;
      }).forEach(item => {
      this.recent_room_list.push(item);
    });  
    });
  }

  ConvertToInt(val){
    return parseInt(val);
  }
  paginationhidder:boolean;
  actionbk(search:string=''){
    if (search != '' && typeof search != 'undefined') {
      merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.TestyDatabase!.getPyapi(
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
          return this.TestyDatabase!.getPyapi(
            this.sort.active, this.sort.direction, this.paginator.pageIndex, this.dataSource.filter);
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

  editroom(room_id){
    const editroom = this.dialog.open(EditRoomComponent, { data: { id : room_id } });
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
  getPyapi(sort: string, order: string, page: number, filter: string=''): Observable<MessageApi> {

    const href = constant.apiurl + constant.roomlisting;
    const requestUrl =
    `${href}?search=${this.apiService.decodejwts().email}&sort=${sort}&order=${order}&page=${page + 1}`;
    return this.http.get<MessageApi>(requestUrl, this.setHeaders());
  }
}
