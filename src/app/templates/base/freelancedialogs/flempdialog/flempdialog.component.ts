import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import {MatSelectModule} from '@angular/material/select';
import { ApiService } from '../../../../services/api/api.service';
import { country } from '../../../../../data/country';

@Component({
  selector: 'app-flempdialog',
  templateUrl: './flempdialog.component.html',
  styleUrls: ['./flempdialog.component.css']
})
export class FlempdialogComponent implements OnInit {
  editEmpForm: FormGroup;
  popupTitle;
  selectedCountry;
  selectedRole;
  formyears: any = [];
  toyears: any = [];
  selectedYearForm;
  selectedYearTo;
  responseData;
  country = country.list;
  year_to_display = true;
  // error message
  errorMsg = '';
  errorMsgArr: any = [];

  constructor(
    formBulider: FormBuilder,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<FlempdialogComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public getdata: any
  ) {
    this.formyears = this.getdata.from_year;
    this.toyears = this.getdata.to_year;
    this.editEmpForm = formBulider.group({
      'organization': [this.getdata.organization, Validators.compose([Validators.required,
        this.noWhitespaceValidator,
        Validators.maxLength(250)])],
      'location': [this.getdata.location, Validators.compose([Validators.required,
        this.noWhitespaceValidator,
        Validators.maxLength(250)])],
      'country': [this.getdata.country, Validators.compose([Validators.required])],
      'title': [this.getdata.title, Validators.compose([Validators.required,
        this.noWhitespaceValidator,
        Validators.maxLength(250)])],
      'role': [this.getdata.role, Validators.compose([Validators.required])],
      'year_from': [this.getdata.year_from, Validators.compose([Validators.required])],
      'year_to': [this.getdata.year_to, Validators.compose([Validators.required])],
      'currently_working_here': [this.getdata.currently_working_here],
      'description': [this.getdata.description]
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  ngOnInit() {
    this.selectedCountry = this.getdata.country;
    this.selectedRole = this.getdata.role;
    this.popupTitle = this.getdata.action === 'edit' ? 'Edit' : 'Add';
    if (this.getdata.currently_working_here === true) {
      this.year_to_display = false;
      this.editEmpForm.get('year_to').clearValidators();
      this.editEmpForm.get('year_to').updateValueAndValidity();
    } else {
      this.year_to_display = true;
      this.editEmpForm.get('year_to').setValidators([Validators.required]);
      this.editEmpForm.get('year_to').updateValueAndValidity();
    }
    this.selectedYearForm = this.getdata.year_from;
    this.selectedYearTo = this.getdata.year_to;
  }

  presentchecked(event) {
    if (event.checked === true) {
      this.year_to_display = false;
      this.editEmpForm.get('year_to').clearValidators();
    } else {
      this.year_to_display = true;
      this.editEmpForm.get('year_to').setValidators([Validators.required]);
    }
    this.editEmpForm.get('year_to').updateValueAndValidity();
  }

  saveEditEmp(formData) {
  
    this.errorMsg = '';
    this.errorMsgArr = [];
    if (this.editEmpForm.valid) {
      const params = {
        'user': this.getdata.user_id,
        'organization': formData.organization,
        'location': formData.location,
        'country': formData.country,
        'title': formData.title,
        'role': formData.role,
        'year_from': formData.year_from,
        'year_to': formData.year_to,
        'currently_working_here': formData.currently_working_here,
        'description': formData.description,
      };
      console.log(formData.currently_working_here)
      if(!formData.currently_working_here){
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
      }else{
        if(params.year_from == 0){
          this.snackBar.open('Please enter From date.');
          setTimeout(() => {
            this.snackBar.dismiss(); 
          }, 1500);
          return false;
        }
      }
      if (this.getdata.action === 'edit') {
        this.apiService.putRequest(this.getdata.api_url + this.getdata.emp_url + this.getdata.emp_id + '/', params ).subscribe(
          data => {
            this.responseData = data;
            if (this.responseData.body !== '') {
              this.dialogRef.close({'status': 'success', 'action': this.getdata.action});
            }
          }, err => {
            console.log(err);
        });
      } else {
        this.apiService.postRequest(this.getdata.api_url + this.getdata.emp_url, params ).subscribe(
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
      return this.editEmpForm.controls[field].hasError('required')
      || this.editEmpForm.controls[field].hasError('whitespace') ? 'Field is required' :
      this.editEmpForm.controls[field].hasError('maxlength') ? 'Field only accept 250 character' : '';
  }

}
