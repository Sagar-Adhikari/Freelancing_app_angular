import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';

import { ApiService } from '../../../../services/api/api.service';

@Component({
  selector: 'app-fldescpdialog',
  templateUrl: './fldescpdialog.component.html',
  styleUrls: ['./fldescpdialog.component.css']
})
export class FldescpdialogComponent implements OnInit {
  jobDescpEditForm: FormGroup;
  responseData;

  // error message
  errorMsg = '';
  errorMsgArr: any = [];
  DescriptionDef = [
    'Describe your strengths and skills',
    'Highlight projects, accomplishments and education'
  ];
  learnmorevar = false;
  Description = this.getdata.content;
  constructor(
    formBulider: FormBuilder,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<FldescpdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public getdata: any,
  ) {
    this.jobDescpEditForm = formBulider.group({
      'description': [this.getdata.content, Validators.compose([Validators.required, this.noWhitespaceValidator])],
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  ngOnInit() {
  }

  onclickcancel() {
    this.dialogRef.close('cancel');
  }

  learnmore(){
    if (this.learnmorevar) {
      this.DescriptionDef.pop();
      this.learnmorevar = false;
    } else {
      this.DescriptionDef.push('Keep it short and make sure its error-free');
      this.learnmorevar = true;
    }
  }
  saveJobDescp(formData) {
    this.errorMsg = '';
    this.errorMsgArr = [];
    if (this.jobDescpEditForm.valid) {
      const params = { 'id': this.getdata.user_id, 'email': this.getdata.email, 'profile': {'description': formData.description} };
      this.apiService.putRequest(this.getdata.api_url + this.getdata.update_url + this.getdata.user_id, params ).subscribe(
          data => {
            this.responseData = data;
            if (this.responseData.body !== '') {
              this.dialogRef.close({'status': 'success', 'description': formData.description});
            }
          }, err => {
            console.log(err);
          });
    } else {
      this.errorMsg = 'error';
    }
  }

  geterrorMsg(field) {
    return this.jobDescpEditForm.controls[field].hasError('required')
    || this.jobDescpEditForm.controls[field].hasError('whitespace') ? 'Field is required' : '';
  }

}
