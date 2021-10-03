import { Component, OnInit, ViewChild, ComponentFactoryResolver, ViewContainerRef, HostListener } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar, MatDialog, MatDialogRef, MatTooltipModule} from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

import { ApiService } from '../../../services/api/api.service';
import { constant } from '../../../../data/constant';

@Component({
  selector: 'app-profilebasic',
  templateUrl: './profilebasic.component.html',
  styleUrls: ['./profilebasic.component.css']
})
export class ProfilebasicComponent implements OnInit {
  proregbasicForm: FormGroup;
  initialData: any = [];
  initialProfileData: any = [];
  responseData: any = [];
  comp_emps = [
    { 'key': 'it\'s just me', 'name': 'It\'s just me' },
    { 'key': '2-9 employees', 'name': '2-9 employees' },
    { 'key': '10-99 employees', 'name': '10-99 employees' },
    { 'key': '100-499 employees', 'name': '100-499 employees' },
    { 'key': '500-1000 employees', 'name': '500-1000 employees' },
    { 'key': 'more than 1000 employees', 'name': 'More than 1000 employees' }
  ];
  comp_depts = [
    { 'key': 'customer service or operations', 'name': 'Customer Service or Operations' },
    { 'key': 'finance or legal', 'name': 'Finance or Legal' },
    { 'key': 'engineering or product management', 'name': 'Engineering or Product management' },
    { 'key': 'marketing or sales', 'name': 'Marketing or Sales' },
    { 'key': 'human resources', 'name': 'Human Resources' },
    { 'key': 'other', 'name': 'Other' }
  ];
  comp_roles = [
    { 'key': 'vice-president or above', 'name': 'Vice-President or above' },
    { 'key': 'manager or director', 'name': 'Manager or Director' },
    { 'key': 'sole proprietor or self-employed', 'name': 'Sole Proprietor or Self-employed' },
    { 'key': 'individual contributor or developer', 'name': 'Individual Contributor or Developer' },
    { 'key': 'student or intern', 'name': 'Student or Intern' }
  ];
  // error message
  errorMsg = '';
  errorMsgArr: any;
  userID; userEmail;
  departmentValue: any = "";
  constructor(
    private formBulider: FormBuilder,
    private apiService: ApiService,
    public router: Router
  ) {
    this.proregbasicForm = formBulider.group({
      'company_employees': [null, Validators.compose([Validators.required])],
      'company_department': [null, Validators.compose([Validators.required])],
      'other_department':[null],
      'company_role': [null, Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {
    this.userID = this.apiService.decodejwts().userid;
    this.userEmail = this.apiService.decodejwts().email;
    this.getUserProfile();
  }

  getUserProfile() {
    this.apiService.getRequest(constant.apiurl + constant.get_user_details + this.userID + '/').subscribe(
      data => {
        this.initialData = data;
        if (this.initialData.status === 200) {
          this.initialProfileData = this.initialData.body;
          if (
            this.initialProfileData.profile.company_employees != '' &&
            this.initialProfileData.profile.company_employees != null) {
            this.router.navigate(['/joblisting']);
          }
        }

      }, err => {
        console.log(err);
    });
  }

  basicRegForm(formData) {
    this.errorMsg = '';
    this.errorMsgArr = [];
    if (this.proregbasicForm.valid) {
      if(formData.company_department == 'other' && formData.other_department == null){
        this.errorMsg = 'error';
        return false;
      }
      const params = {
        'id': this.userID,
        'email': this.userEmail,
        'profile': {
          'company_employees': formData.company_employees,
          'company_department': formData.company_department,
          'company_role': formData.company_role,
          'other_department': formData.other_department
        }
      };
      this.apiService.putRequest(constant.apiurl + constant.updateUserDetails + this.userID + '/', params ).subscribe(
          data => {
            this.responseData = data;
            if (this.responseData.body !== '') {
              this.router.navigate(['/joblisting']);
            }
          }, err => {
            console.log(err);
          });
    } else {
      this.errorMsg = 'error';
    }
  }

  geterrorMsg(field) {
    if(field == 'company_department' && this.departmentValue == 'other'){
      return 'Field is required'
    }else{
      return this.proregbasicForm.controls[field].hasError('required') ? 'Field is required' : '';
    }
  }

}
