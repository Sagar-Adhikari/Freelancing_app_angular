import { DOCUMENT } from '@angular/common';
import { Component, OnInit, OnDestroy, Inject, Renderer2 } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApiService } from '../../../services/api/api.service';
import { UserService } from '../../../services/sync/user.service';
import { constant } from '../../../../data/constant';

@Component({
  selector: 'app-notification-popup',
  templateUrl: './notification-popup.component.html',
  styleUrls: ['./notification-popup.component.css']
})
export class NotificationPopupComponent implements OnInit, OnDestroy {
  user_id: any;
  user_type: any;
  notificationResponse: any;
  notList: any = [];
  nLoad: boolean = false;
  nCount: any = 0;
  isMore: boolean = false;
  constructor(
    private apiService: ApiService,
    private usersService: UserService,
    private dialogRef: MatDialogRef<NotificationPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
  ) {
    this.user_id = this.apiService.decodejwts().userid;
    this.user_type = this.apiService.decodejwts().user_type;
  }

  ngOnInit() {
    this.notifcationData();
    this.renderer.addClass(this.document.body, 'custom_class_notification');
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'custom_class_notification');
  }

  notifcationData() {
    this.apiService.getRequest(constant.apiurl + constant.notifications + '?unseen=1&user=' + this.user_id).subscribe(
      responseStatus => {
        this.notificationResponse = responseStatus;
        if (this.notificationResponse.status == '200') {
          this.nLoad = true;
          this.notList = this.notificationResponse.body.results;
          this.nCount = this.notificationResponse.body.count;
          this.isMore = (this.notificationResponse.body.next != null) ? true : false;
        } else {
          console.log(responseStatus);
        }
      }
    );
  }
  seeAllNotification() {
    let iParms = { "type": "all" };
    this.apiService.putRequest(constant.apiurl + constant.notification_update, iParms).subscribe(
      responseStatus => {
        this.usersService.snackErrorMessage('All Notifications have been seen');
        // this.usersService.snackMessage('All Notifications have been seen');
        this.dialogRef.close({'status': 'success'});
      }, err => {
        console.log(err);
      }
    );
  }
  updateSeen(notifyItem: any) { //notification_update
    if (notifyItem.status) {
      let iParms = { "type": "specific", "id": notifyItem.id };
      this.apiService.putRequest(constant.apiurl + constant.notification_update, iParms).subscribe(
        responseStatus => {
          this.dialogRef.close("close");
        }, err => {
          console.log(err);
        }
      );
    } else {
      this.dialogRef.close("close");
    }
  }

}
