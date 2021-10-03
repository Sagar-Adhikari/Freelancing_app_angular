import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { UserService } from '../../../../services/sync/user.service';
import { ApiService } from '../../../../services/api/api.service';
import { country } from '../../../../../data/country';
import { timezone } from '../../../../../data/timezone';
import { constant } from '../../../../../data/constant';

import { RepeatsecurityComponent } from '../repeatsecurity/repeatsecurity.component';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit {
  setPasswordForm: FormGroup;
  setSecQuestForm: FormGroup;
  queryUserID = this.apiService.decodejwts().userid + '/';
  initialData; initialQuesData: any;
  question_lists: any = []; changedPass;
  findUserQuestion: any = [];
  current_lay_display = false;
  customQues = false;
  quesResData: any = [];
  current_ques_id: any;  current_ques_txt: any; current_ans: any;
  selectedOtherQues;
  response_ans_id = '';
  verifyResponse: any = [];
  updatedRespRes: any = [];
  newquesRes: any = [];
  userhaveCusQues: any = [];
  questionID;

  // vaildation error message
  errorMsg: String;
  errorMsgArr: any = [];
  errorQuesMsg: String;
  errorQuesMsgArr: any = [];
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private userService: UserService,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {
    this.setPasswordForm = fb.group({
      'old_password' : [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'new_password' : [null, Validators.compose(
        [ Validators.required,
          this.noWhitespaceValidator,
          Validators.minLength(8),
          Validators.maxLength(25) ])],
      'confirm_password' : [null, Validators.compose(
        [ Validators.required,
          this.noWhitespaceValidator,
          Validators.minLength(8),
          Validators.maxLength(25) ])]
    });
    this.setSecQuestForm = fb.group({
      'old_qust_id' : [null],
      'other_ques_txt' : [null],
      'old_qust_answer' : [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'new_qust' : [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'new_qust_answer' : [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'securityTerms': [null,Validators.required]
    });
  }

  ngOnInit() {
    this.userService.sendHeaderLayout('layout2');
    this.queryUserID = this.apiService.decodejwts().userid;
    this.getUserProfile();
    this.getUserQuestion();
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  getUserProfile() {
    this.apiService.getRequest(constant.apiurl + constant.updateUserDetails + this.queryUserID + '/').subscribe(
      data => {
        this.initialData = data;
      }, err => {
        console.log(err);
    });
  }

  getUserQuestion() {
    this.apiService.getRequest(constant.apiurl + constant.get_questions + this.queryUserID).subscribe(
      data => {
        this.initialQuesData = data;
        if (this.initialQuesData.body) {
          this.question_lists = this.initialQuesData.body;
          // find your have custom question
          this.userhaveCusQues = this.question_lists.find(row => row.user == this.queryUserID);
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
            this.current_lay_display = true;
            this.setSecQuestForm.controls['old_qust_id'].setValue(this.findUserQuestion.id);
            this.current_ques_id = this.findUserQuestion.id;
            this.current_ques_txt = this.findUserQuestion.question;
            this.current_ans = this.quesResData.body.results[0].answer;
            this.response_ans_id = this.quesResData.body.results[0].id;
          }
        }
      }, err => {
        console.log(err);
    });
  }

  submitPasswordForm(formData) {
    this.errorMsg = '';
    this.errorMsgArr = [];
    if (this.setPasswordForm.valid) {
      if (formData.new_password !== formData.confirm_password) {
        this.errorMsg = 'error';
        this.geterrorMsg['new_password'] = 'Password not same';
        return false;
      } else {
        const params = {
          'old_password' : formData.old_password,
          'new_password1' : formData.new_password,
          'new_password2' : formData.confirm_password
        };
        this.apiService.postRequest(constant.apiurl + constant.change_password, params).subscribe(
          data => {
            this.changedPass = data;
            if ( this.changedPass.detail === 'New password has been saved.' ) {
              this.logout();
              this.userService.snackMessage('Please login again with new password');
            }
          }, err => {
            this.errorMsg = 'error';
            if (err != '') {
              if (err.error.new_password2 != '' && typeof err.error.new_password2 != 'undefined')  {
                this.geterrorMsg['new_password'] = err.error.new_password2[0];
              }
              if (err.error.new_password1 != '' && typeof err.error.new_password1 != 'undefined')  {
                this.geterrorMsg['new_password'] = err.error.new_password1[0];
              }
              if (err.error.old_password != '' && typeof err.error.old_password != 'undefined')  {
                this.geterrorMsg['old_password'] = 'Invalid Old Password';
              }
            }
        });
      }
    } else {
      this.errorMsg = 'error';
    }
  }

  logout() {
    localStorage.removeItem('workplus_token');
    localStorage.removeItem('exp_token');
    localStorage.removeItem('user_type');
    localStorage.removeItem('workplus_logo');
    localStorage.removeItem('workplus_appname');
    localStorage.removeItem('workplus_favicon');
    this.userService.userlogin('guest');
    this.router.navigate(['/login']);
  }

  geterrorMsg(field) {
      if ( field === 'new_password' || field === 'confirm_password') {
        return this.setPasswordForm.controls[field].hasError('required')
      || this.setPasswordForm.controls[field].hasError('whitespace') ? 'Field is required' : 
      this.setPasswordForm.controls[field].hasError('minlength')
      || this.setPasswordForm.controls[field].hasError('maxlength') ?
      'Password must great then 8 character and less then 25 character' : '';
      } else {
        return this.setPasswordForm.controls[field].hasError('required') ? 'Field is required' : '';
      }
  }

  onOtherQuestion(value) {
    if (value === 'other') {
      this.customQues = true;
      this.setSecQuestForm.controls['other_ques_txt'].setValidators([Validators.required]);
      this.setSecQuestForm.get('other_ques_txt').updateValueAndValidity();
    } else {
      this.customQues = false;
      this.setSecQuestForm.controls['other_ques_txt'].clearValidators();
      this.setSecQuestForm['controls']['other_ques_txt'].setValue(null);
      this.setSecQuestForm.get('other_ques_txt').updateValueAndValidity();
    }
  }

  submitQuesForm(formData, form) {
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
      // Add new question
      if (this.response_ans_id == '') {
        if (formData.other_ques_txt != null) {
          const newparams = {
            'question' : formData.other_ques_txt,
            'status' : 'Active',
            'user' : this.queryUserID
          };
          this.apiService.postRequest(constant.apiurl + constant.save_security_ques, newparams).subscribe(data => {
            this.newquesRes = data;
            if (this.newquesRes.id != '') {
              const resParams = {
                'user' : this.queryUserID,
                'question' : this.newquesRes.id,
                'answer' : formData.new_qust_answer
              };
              this.apiService.postRequest(constant.apiurl + constant.get_questionres, resParams).subscribe(
                row => {
                  this.updatedRespRes = row;
                  if (this.updatedRespRes.id != '') {
                    this.getQuestionResponse();
                    form.reset();
                    this.userService.snackMessage('Security Question Added successfully');
                  }
                }, err => {
                  console.log(err);
              });
            }
          });
        } else {
          const resParams = {
            'user' : this.queryUserID,
            'question' : formData.new_qust,
            'answer' : formData.new_qust_answer
          };
          this.apiService.postRequest(constant.apiurl + constant.get_questionres, resParams).subscribe(
            row => {
              this.updatedRespRes = row;
              if (this.updatedRespRes.id != '') {
                this.getQuestionResponse();
                form.reset();
                this.userService.snackMessage('Security Question Added successfully');
              }
            }, err => {
              console.log(err);
          });
        }
      } else {
        this.apiService.getRequest(
          constant.apiurl + constant.get_questionres + '?user='
          + this.queryUserID + '&question=' + formData.old_qust_id + '&answer=' + formData.old_qust_answer
        ).subscribe(
          data => {
            // verify old password
            this.verifyResponse = data;
            this.questionID = formData.new_qust;
            if (this.verifyResponse.body.count > 0) {
              if (formData.new_qust == 'other' && this.userhaveCusQues != [] && typeof this.userhaveCusQues !== 'undefined') {
                const Params = {
                  'user' : this.queryUserID,
                  'question' : formData.other_ques_txt,
                  'status' : 'Active',
                };
                console.log(this.userhaveCusQues);
                this.apiService.putRequest(constant.apiurl + constant.save_security_ques + this.userhaveCusQues.id + '/', Params).subscribe(
                  row => {
                    this.updatedRespRes = row;
                    if (this.updatedRespRes.id != '') {
                      this.questionID = this.updatedRespRes.id;
                      const resultParams = {
                        'user' : this.queryUserID,
                        'question' : this.updatedRespRes.id,
                        'answer' : formData.new_qust_answer
                      };
                      this.apiService.putRequest(
                        constant.apiurl + constant.get_questionres + this.response_ans_id + '/', resultParams
                      ).subscribe(
                        resRow => {
                          this.updatedRespRes = resRow;
                          if (this.updatedRespRes.id != '') {
                            this.getQuestionResponse();
                            form.reset();
                            this.userService.snackMessage('Security Question Updated successfully');
                          }
                        }, err => {
                          console.log(err);
                      });
                    }
                  }, err => {
                    console.log(err);
                });
                this.router.navigate(['/setting/password']);
              } else {
                if (formData.new_qust == 'other' && (this.userhaveCusQues == [] || typeof this.userhaveCusQues === 'undefined')) {
                  const newparams = {
                    'question' : formData.other_ques_txt,
                    'status' : 'Active',
                    'user' : this.queryUserID
                  };
                  this.apiService.postRequest(constant.apiurl + constant.save_security_ques, newparams).subscribe(result => {
                    this.newquesRes = result;
                    if (this.newquesRes.id != '') {
                      const resultParams = {
                        'user' : this.queryUserID,
                        'question' : this.newquesRes.id,
                        'answer' : formData.new_qust_answer
                      };
                      this.apiService.postRequest(constant.apiurl + constant.get_questionres, resultParams).subscribe(
                        row => {
                          this.updatedRespRes = row;
                          if (this.updatedRespRes.id != '') {
                            this.getQuestionResponse();
                            form.reset();
                            this.userService.snackMessage('Security Question Updated');
                          }
                        }, err => {
                          console.log(err);
                      });
                    }
                  });
                }
                this.router.navigate(['/setting/password']);
              }
              if (formData.new_qust != 'other') {
                const resParams = {
                  'user' : this.queryUserID,
                  'question' : formData.new_qust,
                  'answer' : formData.new_qust_answer
                };
                this.apiService.putRequest(constant.apiurl + constant.get_questionres + this.response_ans_id + '/', resParams).subscribe(
                  row => {
                    this.updatedRespRes = row;
                    if (this.updatedRespRes.id != '') {
                      this.getQuestionResponse();
                      form.reset();
                      this.userService.snackMessage('Security Question Updated');
                    }
                  }, err => {
                    console.log(err);
                });
              }
            } else {
              this.errorQuesMsg = 'error';
              this.errorQuesMsgArr['old_qust_answer'] = 'Please enter valid answer';
            }
          }, err => {
            console.log(err);
        });
      }
    } else {
      this.errorQuesMsg = 'error';
    }
  }

  geterrorQuesMsg(field) {
    return this.setSecQuestForm.controls[field].hasError('required')
    || this.setSecQuestForm.controls[field].hasError('whitespace') ? 'Field is required' : '';
  }
}
