import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';

import { ApiService } from '../../../../services/api/api.service';

@Component({
  selector: 'app-flotherexpdialog',
  templateUrl: './flotherexpdialog.component.html',
  styleUrls: ['./flotherexpdialog.component.css']
})
export class FlotherexpdialogComponent implements OnInit {
  otherExperienceForm: FormGroup;
  responseData: any = [];
  popupTitle;
  // error message
  errorMsg = '';
  errorMsgArr: any = [];

  constructor(
    formBulider: FormBuilder,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<FlotherexpdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public getdata: any,
  ) {
    this.otherExperienceForm = formBulider.group({
      'subject': [this.getdata.other_subject, Validators.compose([Validators.required,
        this.noWhitespaceValidator,
        Validators.maxLength(250)])],
      'description': [this.getdata.other_description, Validators.compose([Validators.required])]
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  ngOnInit() {
    this.popupTitle = this.getdata.action === 'edit' ? 'Edit' : 'Add';
  }

  saveOtherExp(formData) {
    this.errorMsg = '';
    this.errorMsgArr = [];
    if (this.otherExperienceForm.valid) {
      if (this.getdata.action === 'edit') {
        const params = {
          'user': this.getdata.user_id,
          'subject': formData.subject,
          'description': formData.description
        };
        this.apiService.putRequest(this.getdata.api_url + this.getdata.saveotherskill + this.getdata.other_id + '/', params ).subscribe(
          data => {
            this.responseData = data;
            if (this.responseData.body !== '') {
              this.dialogRef.close({'status': 'success', 'action': this.getdata.action});
            }
          }, err => {
            console.log(err);
        });
      } else {
        const params = {
          'user': this.getdata.user_id,
          'subject': formData.subject,
          'description': formData.description,
        };
        this.apiService.postRequest(this.getdata.api_url + this.getdata.saveotherskill, params ).subscribe(
          data => {
            this.responseData = data;
            if (this.responseData.body !== '') {
              this.dialogRef.close({'status': 'success', 'action': this.getdata.action});
            }
          }, err => {
            console.log(err);
        });
      }
    } else {
      this.errorMsg = 'error';
    }
  }

  onclickcancel() {
    this.dialogRef.close('cancel');
  }

  geterrorMsg(field) {
      return this.otherExperienceForm.controls[field].hasError('required') ? 'Field is required' :
      this.otherExperienceForm.controls[field].hasError('maxlength') ? 'Field only accept 250 character' : '';
  }

}
