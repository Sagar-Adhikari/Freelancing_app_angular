import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api/api.service';
import { UserService } from '../../../services/sync/user.service';
import { constant } from '../../../../data/constant';
@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css']
})
export class NotificationListComponent implements OnInit {
  user_id: any;
  user_type: any;
  notificationResponse: any;
  notList: any = [];
  nLoad: boolean = false;
  nCount: any = 0;
  isMore: boolean = false;
  page: any = 1;
  constructor(
    private apiService: ApiService,
    private usersService: UserService
  ) {
    this.user_id = this.apiService.decodejwts().userid;
    this.user_type = this.apiService.decodejwts().user_type;
  }

  ngOnInit() {
    this.page = 1;
    this.notifcationData();
  }
  notifcationData() {
    this.apiService.getRequest(constant.apiurl + constant.notifications + '?user=' + this.user_id+'&type=Message').subscribe(
      responseStatus => {
        this.notificationResponse = responseStatus;
        if (this.notificationResponse.status == '200') {
          this.nLoad = true;
          let removeTypemsgArr = this.notificationResponse.body.results;
          let afterRemovedmsg = [];
          removeTypemsgArr.map((data,index)=>{
            if(data.type !== 'Message'){
              afterRemovedmsg.push(data)
            }
          })
          this.notList = afterRemovedmsg;
          console.log()
          this.nCount = this.notificationResponse.body.count;
          this.isMore = (this.notificationResponse.body.next != null) ? true : false;
        } else {
          console.log(responseStatus);
        }
      }
    );
  }
  moreNotification() {
    this.page++;
    this.apiService.getRequest(constant.apiurl + constant.notifications + '?user=' + this.user_id + '&page=' + this.page).subscribe(
      responseStatus => {
        this.notificationResponse = responseStatus;
        if (this.notificationResponse.status == '200') {
          this.nLoad = true;
          this.notificationResponse.body.results.forEach(element => {
            this.notList.push(element);
          });
          this.nCount = this.notificationResponse.body.count;
          this.isMore = (this.notificationResponse.body.next != null) ? true : false;
        } else {
          console.log(responseStatus);
        }
      }
    );
  }
  updateSeen(notifyItem: any) {
    if (notifyItem.status) {
      let iParms = { "type": "specific", "id": notifyItem.id };
      this.apiService.putRequest(constant.apiurl + constant.notification_update, iParms).subscribe(
        responseStatus => {
        }, err => {
          console.log(err);
        }
      );
    }
  }
  deleteNotification(notifyItem: any) {
    if (notifyItem.id) {
      const nIndex = this.notList.findIndex(x => x.id == notifyItem.id);
      this.notList.splice(nIndex, 1);
      let iParms = {};
      this.apiService.deleteRequest(constant.apiurl + constant.notifications + notifyItem.id, iParms).subscribe(
        responseStatus => {
          this.nCount = this.nCount - 1;
          console.log(responseStatus);
        }, err => {
          console.log(err);
        }
      );
    }
  }

}
