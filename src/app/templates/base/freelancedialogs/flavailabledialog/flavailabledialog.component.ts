import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import * as moment from 'moment';

import { ApiService } from '../../../../services/api/api.service';

@Component({
  selector: 'app-flavailabledialog',
  templateUrl: './flavailabledialog.component.html',
  styleUrls: ['./flavailabledialog.component.css']
})
export class FlavailabledialogComponent implements OnInit {
  availableEditForm: FormGroup;
  responseData;
  typeavaiables = [
    { 'key': 'available', 'name': 'Available' },
    { 'key': 'not', 'name': 'Not Available' }
  ];
  fieldDisplay = true;
  dailytypes = [
    { 'key': '1', 'name': 'More than 30 hrs/week' },
    { 'key': '2', 'name': 'Less than 30 hrs/week' },
    { 'key': '3', 'name': 'As Needed - Open to Offers' },
  ];
  defaultType = '1';
  defaultAvaiable = 'not';
  minendDate = moment().format();
  // error message
  errorMsg = '';
  errorMsgArr: any = [];

  constructor(
    formBulider: FormBuilder,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<FlavailabledialogComponent>,
    @Inject(MAT_DIALOG_DATA) public getdata: any,
  ) {
    this.availableEditForm = formBulider.group({
      'available_type': [null],
      'daily_availability': [this.getdata.initialAvailable, Validators.compose([Validators.required])],
      'expected_availability': [this.getdata.initialexcepted]
    });
   }

  ngOnInit() {
    if (this.getdata.initialAvailable === 4) {
      this.fieldDisplay = false;
      this.defaultAvaiable = 'not';
      this.availableEditForm.get('expected_availability').setValidators([Validators.required]);
      this.availableEditForm.get('daily_availability').clearValidators();
      this.availableEditForm['controls']['daily_availability'].setValue(4);
    } else {
      this.defaultAvaiable = 'available';
      this.fieldDisplay = true;
      this.defaultType = this.getdata.initialAvailable;
      this.availableEditForm.get('daily_availability').setValidators([Validators.required]);
      this.availableEditForm.get('expected_availability').clearValidators();
      this.availableEditForm['controls']['expected_availability'].setValue(null);
    }
    this.availableEditForm.get('expected_availability').updateValueAndValidity();
    this.availableEditForm.get('daily_availability').updateValueAndValidity();
  }

  changeExceptedDateEvent(e) {
    this.availableEditForm.controls['expected_availability'].setValue(moment(e.value, 'L', true).format('YYYY-MM-DD'));
  }

  onselectAvailble(event) {
    if (event.value === 'not') {
      this.fieldDisplay = false;
      this.availableEditForm.get('expected_availability').setValidators([Validators.required]);
      this.availableEditForm.get('daily_availability').clearValidators();
      this.availableEditForm['controls']['daily_availability'].setValue(4);
    } else {
      this.fieldDisplay = true;
      this.defaultType = '1';
      this.availableEditForm.get('daily_availability').setValidators([Validators.required]);
      this.availableEditForm.get('expected_availability').clearValidators();
      this.availableEditForm['controls']['expected_availability'].setValue(null);
    }
    this.availableEditForm.get('expected_availability').updateValueAndValidity();
    this.availableEditForm.get('daily_availability').updateValueAndValidity();
  }

  onclickcancel() {
    this.dialogRef.close('cancel');
  }

  saveAvailable(formData) {
    this.errorMsg = '';
    this.errorMsgArr = [];
    if (this.availableEditForm.valid) {
      const params = {
        'id': this.getdata.user_id,
        'email': this.getdata.email,
          'profile': {
            'daily_availability': formData.daily_availability,
            'expected_availability': formData.expected_availability,
          }
        };
      this.apiService.putRequest(this.getdata.api_url + this.getdata.update_url + this.getdata.user_id + '/', params ).subscribe(
          data => {
            this.responseData = data;
            if (this.responseData.body !== '') {
              this.dialogRef.close({
                'status': 'success',
                'available': formData.daily_availability,
                'expected': formData.expected_availability
              });
            }
          }, err => {
            console.log(err);
          });
    } else {
      this.errorMsg = 'error';
    }
  }

  geterrorMsg(field) {
    return this.availableEditForm.controls[field].hasError('required') ? 'Field is required' : '';
  }

}
