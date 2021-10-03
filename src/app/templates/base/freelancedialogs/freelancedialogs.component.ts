import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';

import { ApiService } from '../../../services/api/api.service';

@Component({
  selector: 'app-freelancedialogs',
  templateUrl: './freelancedialogs.component.html',
  styleUrls: ['./freelancedialogs.component.css']
})
export class FreelancedialogsComponent implements OnInit {
  jobTitleEditForm: FormGroup;
  responseData;

  // error message
  errorMsg = '';
  errorMsgArr: any = [];

  constructor(
    formBulider: FormBuilder,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<FreelancedialogsComponent>,
    @Inject(MAT_DIALOG_DATA) public getdata: any
  ) {
    this.jobTitleEditForm = formBulider.group({
      'title': [this.getdata.content.trim(), Validators.compose([
        Validators.required,
        this.noWhitespaceValidator,
        Validators.maxLength(250)])],
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  ngOnInit() {
  }

  saveJobTitle(formData) {
    this.errorMsg = '';
    this.errorMsgArr = [];
    if (this.jobTitleEditForm.valid) {
      const params = { 'id': this.getdata.user_id, 'email': this.getdata.email, 'profile': {'title': formData.title} };
      this.apiService.putRequest(this.getdata.api_url + this.getdata.update_url + this.getdata.user_id, params ).subscribe(
          data => {
            this.responseData = data;
            if (this.responseData.body !== '') {
              this.dialogRef.close({'status': 'success', 'title': formData.title});
            }
          }, err => {
            if (err.error.profile.title.length > 0) {
              this.errorMsg = 'error';
              this.errorMsgArr['title'] = 'Please enter less then 250 character';
            }
          });
      } else {
        this.errorMsg = 'error';
      }
  }

  geterrorMsg(field) {
    return this.jobTitleEditForm.controls[field].hasError('required')
    || this.jobTitleEditForm.controls[field].hasError('whitespace') ? 'Field is required' :
    this.jobTitleEditForm.controls[field].hasError('maxlength') ? 'Field only accept 250 character' : '';
  }

  onclickcancel() {
    this.dialogRef.close('cancel');
  }

}
