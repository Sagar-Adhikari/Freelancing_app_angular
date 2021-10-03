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
  selector: 'app-disputes-edit',
  templateUrl: './disputes-edit.component.html',
  styleUrls: ['./disputes-edit.component.css']
})
export class DisputesEditComponent implements OnInit {

  constructor(private activeRoute: ActivatedRoute ,private api: ApiService,private http: HttpClient,  public dialog: MatDialog, public snackBar: MatSnackBar) { }
  contractId = this.activeRoute.snapshot.params;
  disputeDetailArr;
  ngOnInit() {
    this.getDisputesDetails();
  }
  goback(){
    window.history.back();
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
  ChangeDisputeAmount(event,disputeDetailArr){
    console.log(event);
    console.log(disputeDetailArr.amount);
    event = parseFloat(event);
    var amt = parseFloat(disputeDetailArr.amount);
    if(event > amt){
      this.snackBar.open('Amount should not exceed '+amt, '', {
          duration: 3000,
        });
      return false;
    }
    let data = {'contract':disputeDetailArr.contract, 'reason_subject':disputeDetailArr.reason_subject, 'detail_reason':disputeDetailArr.detail_reason, 'amount':event};
    this.api.putRequest(constant.apiurl + constant.disputes_details + this.contractId.id +'/',data).subscribe(data => {
    this.snackBar.open('Updated Successfully', '', {
          duration: 3000,
        });
    this.getDisputesDetails();
    },error => console.log(error))
  }
}
