import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ApiService } from '../../../services/api/api.service';
import { constant } from '../../../../data/constant';
import { Router } from '@angular/router';

@Component({
  selector: 'app-common-alert',
  templateUrl: './common-alert.component.html',
  styleUrls: ['./common-alert.component.css']
})
export class CommonAlertComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CommonAlertComponent>,
    public api : ApiService,
    private router:Router,
  ) { }
  continueDisable:boolean;
  userID = this.api.decodejwts().userid; 

  ngOnInit() {
  }
  onNoClick(): void {
    this.dialogRef.close({'status': 'cancel','data': 'cancel'});
  }
  
  onclickenter(){
    this.continueDisable = false;
    const params = {
      'answer': '',
      'user': this.userID,
      'groups': this.data.group_id,
      'question': this.data.questionId
  };
    this.answerTheQuestion(params);
  }
  answerTheQuestion(params) {
    this.api.postRequest(constant.apiurl + constant.answerTestQuestions + '?group=' + this.data.group_id + '&user=' + this.userID, params).subscribe(
      data => {
      // console.log(data);
          this.continueDisable = true;
          this.dialogRef.close({'status': 'success','page': this.data['page']});
        }, err => {
          this.dialogRef.close({'status': 'error','data': 'error'});
        console.log('error')
    });
  }

}
