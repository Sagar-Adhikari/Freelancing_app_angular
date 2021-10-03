import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ApiService } from '../../../services/api/api.service';
import { constant } from '../../../../data/constant';

@Component({
  selector: 'app-deletion',
  templateUrl: './deletion.component.html',
  styleUrls: ['./deletion.component.css']
})
export class DeletionComponent implements OnInit {

   constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DeletionComponent>,
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

    if(this.data.from == 'page') {
      actionURL = constant.admincmslist+this.data.id+'/';
      params    = '';
    }else if (this.data.from == 'membership') {
      actionURL = constant.adminmembership+this.data.id+'/';
      params    = '';
    }else if (this.data.from == 'testimonials') {
      actionURL = constant.admintestimonialsurl+this.data.id+'/';
      params    = '';
    }else if (this.data.from == 'securityqtn') {
      actionURL = constant.adminsecqtnurl+this.data.id+'/';
      params    = '';
    }else if (this.data.from == 'suggestedqtn') {
      actionURL = constant.suggestedquestions+'/'+this.data.id;
      params    = '';
    }else if (this.data.from == 'language') {
      actionURL = constant.adminlanglist+this.data.id+'/';
      params    = '';
    }
    const href = constant.apiurl+actionURL;    
    this.api.deleteRequest(href,params).subscribe(
      data => {
         //console.log(data);
      }
    );    
  }

}
