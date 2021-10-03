import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { merge } from 'rxjs/observable/merge';
import { of as observableOf } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';
import { startWith } from 'rxjs/operators/startWith';
import { switchMap } from 'rxjs/operators/switchMap';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Title }     from '@angular/platform-browser';
import {MatPaginator, MatTableDataSource} from '@angular/material';

import { ISlimScrollOptions } from '../../ngx-slimscroll/classes/slimscroll-options.class';
import { SlimScrollState, ISlimScrollState } from '../../ngx-slimscroll/classes/slimscroll-state.class';
import { UserService } from '../../services/sync/user.service';
import { ApiService } from '../../services/api/api.service';
import { constant } from '../../../data/constant';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  

    // Private Legend and Labels Properties
    public options: any = {
      responsive: true,
      cutoutPercentage: 80,
      datasets:
        {
          borderWidth: 8,
        },
      legend:
        {
          position: 'top',
          boxWidth: 12,
  
          labels:
            {
              boxWidth: 12,
              fontSize: 11,
            }
        },
    }



      // Mobile Doughnut Start
  public doughnutChartMobileLabels: string[] = ['Information-1', 'Information-2'];
  public doughnutChartMobileData: number[] = [50, 10];
  public doughnutChartMobileType: string = 'doughnut';
  // Mobile Doughnut End


  countData:any;
  isCountLoaded:boolean = false;
  bidsdisplayedColumns: string[] = ['job_id','client_name', 'username','payment','budget','status', 'created','action'];
  bidsDatabase: BidspyHttpDao | null;
  bidsdata: BidslistData[] = [];
  bidsdataSource = new MatTableDataSource<BidslistData>();
  isBidsLoadingResults = true;
  isBidsRateLimitReached = false;
  bidsresultsLength = 0;
  hiredLevelTxt = { 'Entry' : '$',
    'Intermediate': '$$',
    'Expert': '$$$'
  };
  exp_levels = [
    { 'key': 'Entry', 'name': 'Entry Level' },
    { 'key': 'Intermediate', 'name': 'Intermediate' },
    { 'key': 'Expert', 'name': 'Expert' }
  ];  


  jobsdisplayedColumns = ['user_name', 'name', 'status', 'created', 'action'];
  JobsDatabase: JobspyHttpDao | null;
  jobsdata: JobslistData[] = [];
  jobsdataSource = new MatTableDataSource<JobslistData>();
  isLoadingResults = true;
  isRateLimitReached = false;
  resultsLength = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
    constructor(private http: HttpClient,private router:Router, route:ActivatedRoute, private titleService: Title,private apiService: ApiService,) {
  }  
    // events
    public chartClicked(e:any):void {
      console.log(e);
    }

  ngOnInit() {
    this.getDashboardCount();
    this.JobsDatabase = new JobspyHttpDao(this.http);
    this.actionJobs();
    this.bidsDatabase = new BidspyHttpDao(this.http);
    this.actionBids();
  }
  actionJobs(){
    merge()
    .pipe(
    startWith({}),
    switchMap(() => {
      this.isLoadingResults = true;
      return this.JobsDatabase!.getPyapi();
    }),
    map(data => {
      this.isLoadingResults = false;
      this.isRateLimitReached = false;
      this.resultsLength = data.count;
      this.jobsdataSource.data = data.results;
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
    ).subscribe(data => this.jobsdata = data);
  }

  actionBids(){
    merge()
    .pipe(
    startWith({}),
    switchMap(() => {
      this.isBidsLoadingResults = true;
      return this.bidsDatabase!.getBidsapi();
    }),
    map(biddata => {
      this.isBidsLoadingResults = false;
      this.isBidsRateLimitReached = false;
      this.bidsresultsLength = biddata.count;
      this.bidsdataSource.data = biddata.results;
      if (biddata.results.length == 0) {
        if (this.paginator.hasPreviousPage()) {
          this.paginator.previousPage();
        }
        return biddata.results;
      } else {
        return biddata.results;
      }
    }),
    catchError(() => {
      this.isBidsLoadingResults = false;
      this.isBidsRateLimitReached = true;
      return observableOf([]);
    })
    ).subscribe(biddata => this.bidsdata = biddata);
  }

  getDashboardCount(){
    this.apiService.getRequest(constant.apiurl + constant.dashboardCount)
      .subscribe(responseData => {
        this.countData = responseData['body'];
        this.isCountLoaded = true;
      })
  }

  public chartHovered(e:any):void {
    console.log(e);
  }

}
// getting jobs 
export interface JobsApi {
  results: JobslistData[];
  count: number;
}

export interface JobslistData {
  id: any;
  user_name: string;
  category_name: string;
  sub_categorie_name: string;
  name: string;
  status: string;
  created: string;
}
export class JobspyHttpDao {
  constructor(private http: HttpClient) {}
  public get authHeader(): string {
    return `JWT ${localStorage.getItem('exp_token')}`;
  }
  setHeaders() {
    return {
      headers: new HttpHeaders().set('Authorization', this.authHeader)
    };
  }
  getPyapi(): Observable<JobsApi> {
    const href = constant.apiurl + constant.adminjobs;
    const requestUrl =
        `${href}?sort=created&order=desc&page=1`;
    return this.http.get<JobsApi>(requestUrl, this.setHeaders());
  }
}

// getting Bids 
export interface BidsApi {
  results: BidslistData[];
  count: number;
}
export interface BidslistData {
  id: any;
  job_id: any;
  title: string;
  client_name:string;
  username: string;
  bid_amount: string;
  created: string;
  status: string;
  experience_level:string;
  payment:string;
  name:string;
  payment_amount:number;
  freelancer_name:string;
}
export class BidspyHttpDao {
  constructor(private bidhttp: HttpClient) {}
  public get authHeader(): string {
    return `JWT ${localStorage.getItem('exp_token')}`;
  }
  setHeaders() {
    return {
      headers: new HttpHeaders().set('Authorization', this.authHeader)
    };
  }
  getBidsapi(): Observable<BidsApi> {
    const href = constant.apiurl + constant.job_proposal;
    const requestUrl =
        `${href}?sort=created&order=desc&page=1`;
    return this.bidhttp.get<BidsApi>(requestUrl, this.setHeaders());
  }
}

