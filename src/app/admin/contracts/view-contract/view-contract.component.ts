import { Component, OnInit, HostListener } from '@angular/core';
import { ApiService } from '../../../services/api/api.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { constant } from '../../../../data/constant';
import { country } from '../../../../data/country';

import * as moment from 'moment';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-view-contract',
  templateUrl: './view-contract.component.html',
  styleUrls: ['./view-contract.component.css']
})
export class ViewContractComponent implements OnInit {

  offer_id: any;
  resultData: any;
  offerData: any = {
    type: '',
    job_category: {name: ''},
    job_subcategory: {name: ''}
  };
  display = false;
  countries = country.list;
  contracts_type = [
    { 'key': '1', 'name': 'No limit' },
    { 'key': '2', 'name': '5 hrs/week' },
    { 'key': '3', 'name': '10 hrs/week' },
    { 'key': '4', 'name': '15 hrs/week' },
    { 'key': '5', 'name': '20 hrs/week' },
    { 'key': '6', 'name': '25 hrs/week' },
    { 'key': '7', 'name': '30 hrs/week' },
    { 'key': '8', 'name': '35 hrs/week' },
    { 'key': '9', 'name': '40 hrs/week' },
    { 'key': '10', 'name': 'Other...' },
  ];
  user_avatar_url = constant.apiurl + constant.user_avatar;
  expires: any;
  displayedColumns: string[] = ['name', 'amount', 'due_date', 'activate_status', 'payment_request', 'payment_status'];
  displayedManualColumns: string[] = ['manual_date', 'from_time', 'to_time', 'sum_hours', 'memo'];
  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private DomSan: DomSanitizer) {
    this.offer_id = this.route.snapshot.paramMap.get('id');
    this.offerDetails();
  }

  ngOnInit() {
  }

  offerDetails() {
    this.apiService.getRequest(constant.apiurl + constant.savecontracts + this.offer_id + '/').subscribe(
      data => {
        this.display = true;
        this.resultData = data;
        this.offerData = this.resultData.body;
        const format = moment(this.offerData.created).format('YYYY-MM-DD');
        this.expires = moment(format, 'YYYY/MM/DD').add('days', 7);
      }, err => {
        console.log('Something went wrong.');
      });
  }
}