import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';

import { ApiService } from '../../../../services/api/api.service';

@Component({
  selector: 'app-flvideodialog',
  templateUrl: './flvideodialog.component.html',
  styleUrls: ['./flvideodialog.component.css']
})
export class FlvideodialogComponent implements OnInit {
  jobVideoEditForm: FormGroup;
  responseData;
  selectedType;

  // error message
  errorMsg = '';
  errorMsgArr: any = [];

  constructor(
    formBulider: FormBuilder,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<FlvideodialogComponent>,
    @Inject(MAT_DIALOG_DATA) public getdata: any,
  ) {
    let videoUrl = this.getdata.content.video;
    videoUrl = (videoUrl != null) ? videoUrl.trim() : "";
    this.jobVideoEditForm = formBulider.group({
      'video_url': [videoUrl, Validators.compose([Validators.required,
        this.noWhitespaceValidator,
        Validators.pattern('https://(www\.)?youtube\.com/watch\?.*v=([a-zA-Z0-9]+).*'),
        Validators.maxLength(200)
      ])],
      'video_type': [this.getdata.content.type, Validators.compose([Validators.required])],
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  ngOnInit() {
    this.selectedType = this.getdata.content.type;
  }

  saveJobVideo(formData) {
    this.errorMsg = '';
    this.errorMsgArr = [];
    if (this.jobVideoEditForm.valid) {
      const params = {
        'id': this.getdata.user_id,
        'email': this.getdata.email,
        'profile': {
          'video_url': formData.video_url,
          'video_type': formData.video_type
        }
      };
      this.apiService.putRequest(this.getdata.api_url + this.getdata.update_url + this.getdata.user_id, params ).subscribe(
          data => {
            this.responseData = data;
            if (this.responseData.body !== '') {
              this.dialogRef.close({'status': 'success',
                'content': {
                  'video': formData.video_url,
                  'type': formData.video_type
                }
              });
            }
          }, err => {
            if (err.error.profile.video_url.length > 0) {
              this.errorMsg = 'error';
              this.errorMsgArr['video_url'] = 'Please enter valid url';
            }
          });
    } else {
      this.errorMsg = 'error';
    }
  }

  onclickcancel() {
    this.dialogRef.close('cancel');
  }

  geterrorMsg(field) {
    if ( field === 'video_url' ) {
      return this.jobVideoEditForm.controls[field].hasError('pattern') || this.jobVideoEditForm.controls[field].hasError('whitespace')
      || this.jobVideoEditForm.controls[field].hasError('required') ? 'Please enter valid url' :
      this.jobVideoEditForm.controls[field].hasError('maxlength') ? 'Field only accept 200 character' : '';
    } else {
      return this.jobVideoEditForm.controls[field].hasError('required') ? 'Field is required' : '';
    }
  }

}
