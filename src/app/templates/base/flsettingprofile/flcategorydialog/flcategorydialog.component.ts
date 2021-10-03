import { Component, OnInit, Inject } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';

import { ApiService } from '../../../../services/api/api.service';
import { constant } from '../../../../../data/constant';

@Component({
  selector: 'app-flcategorydialog',
  templateUrl: './flcategorydialog.component.html',
  styleUrls: ['./flcategorydialog.component.css']
})
export class FlcategorydialogComponent implements OnInit {
  setCategoryForm: FormGroup;
  categorylists: any = [];
  categoryArray: any = [];
  categorystring: String;
  initData: String;
  userID; userEmail;
  responseData: any;
  initialCategory:any;

  errorMsg;
  errorMsgArr: any = [];
  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FlcategorydialogComponent>,
    @Inject(MAT_DIALOG_DATA) public getdata: any,
  ) {
    this.setCategoryForm = fb.group({
      'category' : [null],
    });
  }

  ngOnInit() {
    this.userID = this.apiService.decodejwts().userid;
    this.userEmail = this.apiService.decodejwts().email;
    this.getCategoryList();
    if ( this.getdata.category !== '' && this.getdata.category != null ) {
      this.initData = this.getdata.category.toString();
      // console.log(this.getdata.category)
      this.initialCategory = this.initData;
      // console.log(this.initialCategory);
      this.categoryArray = this.getdata.category;
    }
  }

  getCategoryList() {
    this.apiService.getRequest(constant.apiurl + constant.job_category_all)
      .subscribe(responseData => {
        this.categorylists = responseData['body'];
    });
  }

  onChangeCategory(categoryname:string,id: string, isChecked: boolean) {
    let temp_category = categoryname+" / "+id;
    if (isChecked) {
      this.categoryArray.push(temp_category.toString());
    } else {
      const value = this.categoryArray.find(x => x === temp_category.toString());
      const index = this.categoryArray.indexOf(value);
      this.categoryArray.splice(index, 1);
    }
  }
  submitCategoryForm(formData) {
    this.errorMsg = '';
    this.errorMsgArr = [];
    if (this.categoryArray.length === 0) {
      this.errorMsg = 'error';
      this.errorMsgArr['category'] = 'Please select atleast one value';
      return false;
    } else if (this.categoryArray.length > 10) {
      this.errorMsg = 'error';
      this.errorMsgArr['category'] = 'Please select less then 10 category';
      return false;
    }
    if (this.errorMsg === '') {

    if (this.categoryArray.length <= 10) {
      this.categorystring = this.categoryArray.toString();
    }

      const params = {
        'id': this.userID,
        'email': this.userEmail,
          'profile': {
            'category_name': this.categorystring,
          }
        };
      this.apiService.putRequest(constant.apiurl + constant.updateUserDetails + this.userID + '/', params ).subscribe(
          data => {
            this.responseData = data;
            if (this.responseData.body !== '') {
              this.dialogRef.close({
                'status': 'success',
                'fromDialogCategory' : this.categorystring
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
    this.categorystring = this.initData;
    this.dialogRef.close({'status': 'close', 'fromDialogCategory' : this.categorystring});
  }

  geterrorMsg(field) {
    return this.setCategoryForm.controls[field].hasError('required') ? 'Please select atleast one category' : '';
  }

}
