import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatAutocomplete } from '@angular/material';

import { ApiService } from '../../../../services/api/api.service';

@Component({
  selector: 'app-fleditotherdialog',
  templateUrl: './fleditotherdialog.component.html',
  styleUrls: ['./fleditotherdialog.component.css']
})
export class FleditotherdialogComponent implements OnInit {
  engLangEditForm: FormGroup;
  responseData;
  // error message
  errorMsg = '';
  errorMsgArr: any = []; index;
  defaultLang = 'Intermediate';
  initialLang: any = [];
  defaultLangTxt: any;
  defaultLangArr: any = '';
  hideAuto = false;

  englevels = [
    { 'key': 'Elementary', 'name': 'Elementary' },
    { 'key': 'Intermediate', 'name': 'Intermediate' },
    { 'key': 'Advanced', 'name': 'Advanced' },
    { 'key': 'Proficient', 'name': 'Proficient' }
  ];

  langlists: any;
  initialsearch: any;
  search: any;

  @ViewChild('textInput') textInput: ElementRef;

  constructor(
    formBulider: FormBuilder,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<FleditotherdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public getdata: any,
  ) {
    this.engLangEditForm = formBulider.group({
      // 'language': [null, Validators.compose([Validators.required])],
      'language_level': [null, Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {
    this.initialLang = this.getdata.lang_arr;
    this.index = this.getdata.lang_index;
    this.defaultLangArr = this.initialLang[this.index];
    // this.textInput.nativeElement.value = this.defaultLangArr.language;
    this.defaultLangTxt = this.defaultLangArr.language;
    this.defaultLang = this.defaultLangArr.level;
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
    //   this.errorMsg = 'error';
    //   this.errorMsgArr['language'] = 'Please select valid langauge';
    //   return false;
    // }
    if (this.engLangEditForm.valid) {
      this.initialLang.push({'language': this.defaultLangTxt, 'level': formData.language_level});
      this.initialLang.splice(this.index, 1);
      const params = {
        'id': this.getdata.user_id,
        'email': this.getdata.email,
          'profile': {
            'other_language': JSON.stringify(this.initialLang)
          }
        };
        this.apiService.putRequest(this.getdata.api_url + this.getdata.update_url + this.getdata.user_id + '/', params ).subscribe(
          data => {
            this.responseData = data;
            if (this.responseData.body !== '') {
              this.dialogRef.close({
                'status': 'success',
                'other_language': this.initialLang
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
