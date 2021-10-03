import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import * as moment from 'moment';

import { ApiService } from '../../../../services/api/api.service';

@Component({
  selector: 'app-searcheditdialog',
  templateUrl: './searcheditdialog.component.html',
  styleUrls: ['./searcheditdialog.component.css']
})
export class SearcheditdialogComponent implements OnInit {
  searchEditForm: FormGroup;
  responseData;
  // error message
  errorMsg = '';
  errorMsgArr: any = [];

  constructor(
    formBulider: FormBuilder,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<SearcheditdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public getdata: any,
  ) {
    this.searchEditForm = formBulider.group({
      'job_search': [this.getdata.search_text, Validators.compose([Validators.required])]
    });
   }

  ngOnInit() {
    console.log(this.getdata);
  }

  onclickcancel() {
    this.dialogRef.close('cancel');
  }

  onUpdateSearch(formData) {
    this.errorMsg = '';
    this.errorMsgArr = [];
    if (this.searchEditForm.valid) {
      const params = {
        'user': this.getdata.user_id,
        'job_search': formData.job_search
      };
      this.apiService.putRequest(this.getdata.url, params ).subscribe(
          data => {
            this.responseData = data;
            if (this.responseData.body !== '') {
              this.dialogRef.close('success');
            }
          }, err => {
            console.log(err);
          });
    } else {
      this.errorMsg = 'error';
    }
  }

  geterrorMsg(field) {
    return this.searchEditForm.controls[field].hasError('required') ? 'Field is required' : '';
  }

}
