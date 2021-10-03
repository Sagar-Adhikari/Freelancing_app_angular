import { Component, OnInit, Inject } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApiService } from '../../../../services/api/api.service';
import { constant, inputData } from '../../../../../data/constant';

@Component({
  selector: 'app-dynamicquestion',
  templateUrl: './dynamicquestion.component.html',
  styleUrls: ['./dynamicquestion.component.css']
})
export class DynamicquestionComponent implements OnInit {

  questionForm: FormGroup;
  questionID: any;
  defaulttype: any = inputData.defaultQuestionType;
  // error message
  errorMsg = '';
  errorMsgArr: any = [];
  user_id: any;
  optionTypes: any;
  constructor(
    private fb: FormBuilder,
    public apiService: ApiService,
    public dialogRef: MatDialogRef<DynamicquestionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.user_id = this.apiService.decodejwts().userid;
    this.questionForm = fb.group({
      'customquestion': [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'type': [null]
    });
  }

  ngOnInit() {
    this.optionTypes = inputData.questionTypes;
    if (this.data.method == 'edit') {
      this.questionID = this.data.question_id;
      this.questionForm.controls['customquestion'].setValue(this.data.question_name);
      this.questionForm.controls['type'].setValue(this.data.type);
      this.defaulttype = this.data.type;
    }
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  OnQuestionSubmit(formData) {
    const URL = constant.apiurl + constant.jobQuestions;
    const params = {
      'user': this.user_id,
      'question': formData.customquestion,
      'type': formData.type
    };
    this.errorMsg = '';
    this.errorMsgArr = [];
    if (this.questionForm.valid) {
      if (this.data.method == 'edit') {
        this.apiService.putRequest(URL + this.data.question_id, params).subscribe(
          responseStatus => {
            if (responseStatus['id'] != null && responseStatus['id'] != "") {
              this.dialogRef.close(responseStatus);
            } else {
              this.dialogRef.close("error");
            }
          });
      } else if (this.data.method == 'add') {
        this.apiService.postRequest(URL, params).subscribe(
          row => {
            if (row['id'] != null && row['id'] != "") {
              this.dialogRef.close(row);
            } else {
              this.dialogRef.close("error");
            }
          });
      }
    } else {
      this.errorMsg = 'error';
    }
  }

  onCancelClick(): void {
    this.dialogRef.close('close');
  }

  geterrorMsg(field) {
    return this.questionForm.controls[field].hasError('required') || this.questionForm.controls[field].hasError('whitespace')? 'Field is required' : '';
  }
}
