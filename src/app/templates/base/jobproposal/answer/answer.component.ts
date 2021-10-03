import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApiService } from '../../../../services/api/api.service';
import { constant } from '../../../../../data/constant';

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.css']
})
export class AnswerComponent implements OnInit {
  questionID: any;
  questions: any = [];
  user_id: any;
  isLoaded:boolean = false;
  job_id:any;
  constructor(
    public apiService: ApiService,
    public dialogRef: MatDialogRef<AnswerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.user_id = this.apiService.decodejwts().userid;
  }

  ngOnInit() {
      this.job_id = this.data.job_id;
      /* Question Pre-populated Start */
      if (this.data.question_id != '') {
        const selectedQuestionArray = this.data.question_id.split(',');
        if (selectedQuestionArray.length > 0) {
          selectedQuestionArray.forEach(element => {
            this.apiService.getRequest(constant.apiurl + constant.jobQuestions + element)
            .subscribe(responseData => {
              const quesData = responseData['body'];
              this.questions.push({'question_id': quesData.id , 'question': quesData.question, 'answer': "", 'error':false,'errormsg':""});
              this.isLoaded = true;
            });
          });
        }
      }
  }
  OnSubmitAnswer() {
    let isError = false;
    const tempArr = this.questions;
    tempArr.forEach(function (item, index) {
      if(item.answer == ""){
        tempArr[index].error = true;
        tempArr[index].errormsg = "Answer the question";
        isError = true;
        return false;
      }else{
        tempArr[index].error = false;
        tempArr[index].errormsg = "";
      }
  });
    if(!isError){
      this.saveAnswer();
      this.dialogRef.close('success');
    }
  }

  saveAnswer(){
    const tempArr = this.questions;
    if (tempArr.length > 0) {
      tempArr.forEach(element => {
        let params = {'user': this.user_id, 'job': this.job_id, 'question': element.question_id, 'answer': element.answer};
        this.apiService.putRequest(constant.apiurl + constant.jobAnswerUpdate, params)
        .subscribe(responseData => {
          console.log(responseData);
        });
      });
    }
  }

  onCancelClick(): void {
    this.dialogRef.close('close');
  }
}
