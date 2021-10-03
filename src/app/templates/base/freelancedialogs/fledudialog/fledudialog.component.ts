import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';

import { ApiService } from '../../../../services/api/api.service';

@Component({
  selector: 'app-fledudialog',
  templateUrl: './fledudialog.component.html',
  styleUrls: ['./fledudialog.component.css']
})
export class FledudialogComponent implements OnInit {
  editEduForm: FormGroup;
  responseData: any = [];
  formyears: any = [];
  toyears: any = [];
  currentyear;
  popupTitle;
  selectedYearForm; selectedYearTo;
  // error message
  errorMsg = '';
  errorMsgArr: any = [];

  constructor(
    formBulider: FormBuilder,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<FledudialogComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public getdata: any,
  ) {
    this.formyears = this.getdata.from_year;
    this.toyears = this.getdata.to_year;
    this.editEduForm = formBulider.group({
      'organization': [this.getdata.organization, Validators.compose([Validators.required, Validators.maxLength(250)])],
      'year_from': [this.getdata.year_from, Validators.compose([Validators.required])],
      'year_to': [this.getdata.year_to, Validators.compose([Validators.required])],
      'degree': [this.getdata.degree, Validators.compose([Validators.required, Validators.maxLength(250)])],
      'area': [this.getdata.area, Validators.maxLength(250)],
      'description': [this.getdata.description]
    });
  }

  ngOnInit() {
    this.popupTitle = this.getdata.action === 'edit' ? 'Edit' : 'Add';
    this.selectedYearForm = this.getdata.year_from;
    this.selectedYearTo = this.getdata.year_to;
  }

  saveEditEdu(formData) {
    this.errorMsg = '';
    this.errorMsgArr = [];
    if (this.editEduForm.valid) {
      const params = {
        'user': this.getdata.user_id,
        'organization': formData.organization,
        'year_from': formData.year_from,
        'year_to': formData.year_to,
        'degree': formData.degree,
        'area': formData.area,
        'description': formData.description,
      };

      if(params.year_from > params.year_to){
        this.snackBar.open('Not a Valid Format Please check from and To Year.');
				setTimeout(() => {
					this.snackBar.dismiss(); 
				}, 1500);
        return false;
      }
      
      if( params.year_from == 0 ){
        this.snackBar.open('Please enter From date');
				setTimeout(() => {
					this.snackBar.dismiss(); 
				}, 1500);
        return false;
      } 
      
      if (this.getdata.action === 'edit') {
        this.apiService.putRequest(this.getdata.api_url + this.getdata.save_edu + this.getdata.edu_id + '/', params ).subscribe(
          data => {
            this.responseData = data;
            if (this.responseData.body !== '') {
              this.dialogRef.close({'status': 'success', 'action': this.getdata.action});
            }
          }, err => {
            console.log(err);
        });
      } else {
        this.apiService.postRequest(this.getdata.api_url + this.getdata.save_edu, params ).subscribe(
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
      return this.editEduForm.controls[field].hasError('required') ? 'Field is required' :
      this.editEduForm.controls[field].hasError('maxlength') ? 'Field only accept 250 character' : '';
  }

}
