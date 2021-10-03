/**
 * Page : Security Question
 * Use : After security question answered, only allow to edit the user profile page
 * Page Functionality :
 * >>> Create the security form
 * >>> security question based form validation
 * >>> if correct answer provide means user allow to edit and update the user profile details
 * Created Date : 04/08/2018
 * Modified Date : 17/08/2018
 * Copyright : bsetec
 */
import { Component, OnInit } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { UserService } from '../../../../services/sync/user.service';
import { ApiService } from '../../../../services/api/api.service';
import { constant } from '../../../../../data/constant';

@Component({
  selector: 'app-repeatsecurity',
  templateUrl: './repeatsecurity.component.html',
  styleUrls: ['./repeatsecurity.component.css']
})
export class RepeatsecurityComponent implements OnInit {
  setSecQuestForm: FormGroup;
  // vaildation error message variable declaration
  errorQuesMsg: String;
  errorQuesMsgArr: any = [];
  response_ans_id = '';
  user_type = this.apiService.decodejwts().user_type;
  verifyResponse: any = [];
  queryUserID = this.apiService.decodejwts().userid; // logged user id
  loggedBy = this.apiService.decodejwts().user_type;
  quesResData: any = [];
  initialQuesData: any = [];
  question_lists: any = [];
  findUserQuestion: any = [];
  current_ques_txt: any;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    // security question form initialization
    this.setSecQuestForm = fb.group({
      'old_qust_id' : [null],
      'other_ques_txt' : [null],
      'old_qust_answer' : [null, Validators.compose([Validators.required, this.noWhitespaceValidator])]
    });
  }

  ngOnInit() {
    this.userService.sendHeaderLayout('layout2');
    this.getUserQuestion();
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }
  /** Get question list for particular user */
  getUserQuestion() {
    this.apiService.getRequest(constant.apiurl + constant.get_questions + this.queryUserID).subscribe(
      data => {
        this.initialQuesData = data;
        if (this.initialQuesData.body.length > 0) {
          this.question_lists = this.initialQuesData.body;
          this.getQuestionResponse();
        }
      }, err => {
        console.log(err);
    });
  }
  
  getQuestionResponse() {
    this.apiService.getRequest(constant.apiurl + constant.get_questionres + '?user=' + this.queryUserID).subscribe(
      data => {
        this.quesResData = data;
        if (this.quesResData.body.count > 0) {
          this.findUserQuestion = this.question_lists.find(row => row.id == this.quesResData.body.results[0].question);
          if (this.findUserQuestion != null) {
            this.setSecQuestForm.controls['old_qust_id'].setValue(this.findUserQuestion.id);
            this.current_ques_txt = this.findUserQuestion.question;
            this.response_ans_id = this.quesResData.body.results[0].id;
          }
        }
      }, err => {
        console.log(err);
    });
  }
  /** After security form submission, send data's to the api and get response */
  submitQuesForm(formData) {
    this.errorQuesMsg = '';
    this.errorQuesMsgArr = [];
    if (this.response_ans_id == '' || this.response_ans_id == null) {
      this.setSecQuestForm.get('old_qust_answer').clearValidators();
      this.setSecQuestForm.get('old_qust_answer').updateValueAndValidity();
    } else {
      this.setSecQuestForm.controls['old_qust_answer'].setValidators([Validators.required]);
      this.setSecQuestForm.get('old_qust_answer').updateValueAndValidity();
    }
    if (this.setSecQuestForm.valid) {
        this.apiService.getRequest(
          constant.apiurl + constant.get_questionres + '?user='
          + this.queryUserID + '&question=' + formData.old_qust_id + '&answer=' + formData.old_qust_answer
        ).subscribe(
          data => {
            this.verifyResponse = data;
            if (this.verifyResponse.body.count > 0) {
              this.userService.snackMessage('you can edit your profile now');
              localStorage.setItem('againreset', '2');
              setTimeout(function(){
                localStorage.setItem('againreset', '1'); }, 90000);
                
                //let temppath = localStorage.getItem('temp_path');
                //console.log(temppath);
                //if(temppath){
                //  this.router.navigate([temppath]);
                //}else{
                  if(this.user_type == 'Client'){
                    this.router.navigate(['/profileedit']);
                  }else{
                    this.router.navigate(['/freelancer/setting/profile']);
                  }
                  
                //} 
            } else {
              this.errorQuesMsg = 'error';
              this.errorQuesMsgArr['old_qust_answer'] = 'Please enter valid answer';
            }
          }, err => {
            console.log(err);
        });
    } else {
      this.errorQuesMsg = 'error';
    }
  }

  geterrorQuesMsg(field) {
    return this.setSecQuestForm.controls[field].hasError('required')
    || this.setSecQuestForm.controls[field].hasError('whitespace') ? 'Field is required' : '';
  }

}
