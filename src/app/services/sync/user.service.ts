import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SnackbarMsgComponent } from '../../templates/base/snackbar-msg/snackbar-msg.component';

import { ApiService } from '../../services/api/api.service';
import { constant } from '../../../data/constant';

@Injectable()
export class UserService {
  private userType = new BehaviorSubject<string>('guest');
  private alertMessage = new BehaviorSubject<string>('');
  private headerLayout = new BehaviorSubject<string>('layout1');
  private headerinfo = new BehaviorSubject<string>('');
  private headerimg = new BehaviorSubject<string>('');
  private profileActive = new BehaviorSubject<string>('myinfo');
  private timezone = new BehaviorSubject<string>('');
  private jobcount = new BehaviorSubject<string>('');
  private billingcount = new BehaviorSubject<string>('');
  private availableConnect = new BehaviorSubject<string>('');
  private paymentVerified = new BehaviorSubject<string>('');

  topheader = this.userType.asObservable();
  globalAlert = this.alertMessage.asObservable();
  headerLayoutAlert = this.headerLayout.asObservable();
  headerinfoAlert = this.headerinfo.asObservable();
  headerimgs = this.headerimg.asObservable();
  profileActives = this.profileActive.asObservable();
  timezones = this.timezone.asObservable();
  jobcounts = this.jobcount.asObservable();
  billingcounts = this.billingcount.asObservable();
  availableConnects = this.availableConnect.asObservable();
  paymentVerifiedCheck = this.paymentVerified.asObservable();
  configSuccess: MatSnackBarConfig = {
    panelClass: 'custom-class',
    duration: 2000,
    horizontalPosition: 'center',
    verticalPosition: 'top'
  };

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {
    if (this.apiService.decodejwts() != false && this.apiService.decodejwts().userid) {
      this.userType.next('user');
    } else {
      this.userType.next('guest');
    }
  }

  userlogin(newUser) {
    this.userType.next(newUser);
  }

  headerInfo(newUser) {
    this.userType.next(newUser);
  }

  sendMessage(msg) {
    // this.alertMessage.next(msg);
    this.snackBar.open(msg, '', {
      duration: 2000,
      verticalPosition: 'top'
    });
  }
  // success message
  snackMessage(msg: any) {
    this.snackBar.openFromComponent(SnackbarMsgComponent, { data: { message: msg, status: 'success' }, ...this.configSuccess });
  }
  // error message
  snackErrorMessage(msg: any) {
    this.snackBar.openFromComponent(SnackbarMsgComponent, { data: { message: msg, status: 'error' }, ...this.configSuccess });
  }

  sendHeaderLayout(layout) {
    this.headerLayout.next(layout);
  }

  headerinfoAlerts(id) {
    this.headerinfo.next(id);
  }

  setHeaderimg(url) {
    this.headerimg.next(url);
  }

  setEditProfileHeaderActive(sidemenu) {
    this.profileActive.next(sidemenu);
  }

  setTimezone(zone) {
    this.timezone.next(zone);
  }

  setJobcount(count) {
    this.jobcount.next(count);
  }

  setBillingcount(count) {
    this.billingcount.next(count);
  }
  setAvailableConnect(connect) {
    this.availableConnect.next(connect);
  }
  setPaymentVerified(status) {
    this.paymentVerified.next(status);
  }

}
