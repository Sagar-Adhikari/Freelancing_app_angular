import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';

import { ApiService } from '../../../../services/api/api.service';

@Component({
  selector: 'app-fladdlangdialog',
  templateUrl: './fladdlangdialog.component.html',
  styleUrls: ['./fladdlangdialog.component.css']
})
export class FladdlangdialogComponent implements OnInit {
  engLangEditForm: FormGroup;
  responseData;
  // error message
  errorMsg = '';
  errorMsgArr: any = [];
  defaultLang = 'Intermediate';
  initialLang: any = [];
  defaultLangType: any = '';
  updatedLanguage: any = [];
  englevels = [
    { 'key': 'Elementary', 'name': 'Elementary' },
    { 'key': 'Intermediate', 'name': 'Intermediate' },
    { 'key': 'Advanced', 'name': 'Advanced' },
    { 'key': 'Proficient', 'name': 'Proficient' }
  ];

  langlists: any;
  initialsearch: any;
  search: any;


  constructor(
    formBulider: FormBuilder,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<FladdlangdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public getdata: any,
  ) {
    this.engLangEditForm = formBulider.group({
      'language': [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'language_level': [null, Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {
    console.log(this.getdata.init_lang);
    if (this.getdata.init_lang != [] && this.getdata.init_lang != null) {
      this.initialLang = this.getdata.init_lang;
    }
  }

  noWhitespaceValidator(control: FormControl) {
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true }
  }

  filtercategorylists(search = '') {
    if (typeof search === 'object') {
      this.initialsearch = search;
      search = this.initialsearch.name;
    }
    this.apiService.getRequest(this.getdata.api_url + this.getdata.all_lang + '?search=' + search)
      .subscribe(responseData => {
        this.langlists = responseData['body'];
      });
  }

  displayname(lang) {
    if (lang != null) {
      this.initialsearch = lang.language_name;
      return lang.language_name;
    }
  }

  saveEngLang(formData) {
    this.errorMsg = '';
    this.errorMsgArr = [];
    // if (typeof formData.language !== 'object' || formData.language.id === 0) {
    //   // this.errormessage = 'please select valid category';
    //   this.errorMsg = 'error';
    //   this.errorMsgArr['language'] = 'Please select valid langauge';
    //   return false;
    // }
    if (this.engLangEditForm.valid) {
      this.initialLang.push({'language': formData.language, 'level': formData.language_level});
      const initialLang =  this.getdata.init_lang != '1'
       && this.getdata.init_lang != null && this.getdata.init_lang != '' ? this.getdata.init_lang + ',' : '';
      const params = {
        'id': this.getdata.user_id,
        'email': this.getdata.email,
          'profile': {
            'other_language': JSON.stringify(this.initialLang)
          }
        };
        console.log(params);
      this.apiService.putRequest(this.getdata.api_url + this.getdata.update_url + this.getdata.user_id + '/', params ).subscribe(
          data => {
            this.responseData = data;
            if (this.responseData.body !== '') {
              this.dialogRef.close({
                'status': 'success',
                'other_language': this.initialLang,
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
    if (field) {
      return this.engLangEditForm.controls[field].hasError('required') || this.engLangEditForm.controls[field].hasError('whitespace') ? 'Field is required' : '';
    } else if (field) {
      return this.engLangEditForm.controls[field].hasError('required') ? 'Field is required' : '';
    }
  }

}
