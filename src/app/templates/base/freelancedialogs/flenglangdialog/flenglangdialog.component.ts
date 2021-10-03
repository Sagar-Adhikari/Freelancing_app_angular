import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';

import { ApiService } from '../../../../services/api/api.service';
@Component({
  selector: 'app-flenglangdialog',
  templateUrl: './flenglangdialog.component.html',
  styleUrls: ['./flenglangdialog.component.css']
})
export class FlenglangdialogComponent implements OnInit {
  engLangEditForm: FormGroup;
  responseData;
  // error message
  errorMsg = '';
  errorMsgArr: any = [];
  defaultLang = 'Intermediate';
  englevels = [
    { 'key': 'Elementary', 'name': 'Elementary' },
    { 'key': 'Intermediate', 'name': 'Intermediate' },
    { 'key': 'Advanced', 'name': 'Advanced' },
    { 'key': 'Proficient', 'name': 'Proficient' }
  ];
  constructor(
    formBulider: FormBuilder,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<FlenglangdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public getdata: any,
  ) {
    this.engLangEditForm = formBulider.group({
      'english_level': [null, Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {
    if (this.getdata.english_level !== '') {
      this.defaultLang = this.getdata.english_level;
    }
  }

  saveEngLang(formData) {
    this.errorMsg = '';
    this.errorMsgArr = [];
    if (this.engLangEditForm.valid) {
      const params = {
        'id': this.getdata.user_id,
        'email': this.getdata.email,
          'profile': {
            'english_level': formData.english_level,
          }
        };
      this.apiService.putRequest(this.getdata.api_url + this.getdata.update_url + this.getdata.user_id + '/', params ).subscribe(
          data => {
            this.responseData = data;
            if (this.responseData.body !== '') {
              this.dialogRef.close({
                'status': 'success',
                'english_level': formData.english_level
              });
            }
          }, err => {
            console.log(err);
          });
    } else {
      this.errorMsg = 'error';
    }
  }

  onclickcancel() {
    this.dialogRef.close('cancel');
  }

  geterrorMsg(field) {
    return this.engLangEditForm.controls[field].hasError('required') ? 'Field is required' : '';
  }

}
