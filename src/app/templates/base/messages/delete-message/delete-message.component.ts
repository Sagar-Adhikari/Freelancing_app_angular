import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ApiService } from '../../../../services/api/api.service';
import { constant } from '../../../../../data/constant';

@Component({
  selector: 'app-delete-message',
  templateUrl: './delete-message.component.html',
  styleUrls: ['./delete-message.component.css']
})
export class DeleteMessageComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DeleteMessageComponent>,
    public api : ApiService
  ) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    var actionURL;
    var params;
    var userID = this.api.decodejwts().userid;
    var accessToken = this.api.decodejwts().access_token;

    if(this.data.from == 'msg') {
      actionURL = constant.msglisting+this.data.id+'/';
      params    = '';

      const href = constant.apiurl+actionURL;    
      this.api.deleteRequest(href,params).subscribe(
        data => {
           // console.log(data);
        }
      );
    }else if(this.data.from=='remove_user'){
      const href = constant.apiurl+actionURL;    
      var datas = { user: this.api.decodejwts().userid,
                id: this.data.room_id,
                email: this.data.email,
                type: 'remove'
              };
       this.api.putRequest(constant.apiurl + constant.addpeople, datas).subscribe(
        data => {
           // console.log(data);
        }
      );
    }       
  }

}