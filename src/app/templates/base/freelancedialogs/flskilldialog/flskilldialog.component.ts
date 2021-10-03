import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';

import { ApiService } from '../../../../services/api/api.service';

@Component({
  selector: 'app-flskilldialog',
  templateUrl: './flskilldialog.component.html',
  styleUrls: ['./flskilldialog.component.css']
})
export class FlskilldialogComponent implements OnInit {
  jobSkillEditForm: FormGroup;
  responseData: any = [];
  skillscreate: any = [];
  skillsidcreate: any = [];
  resultSkill: any;
  skillstring;
  skillidstring;
  skillists = [];
  initialSkillRes: any = [];
  defaultSelectSkill: any = [];
  // error message
  errorMsg = '';
  errorMsgArr: any = [];

  constructor(
    formBulider: FormBuilder,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<FlskilldialogComponent>,
    @Inject(MAT_DIALOG_DATA) public getdata: any,
  ) {
    this.jobSkillEditForm = formBulider.group({
      'skills': [this.getdata.content.skills, Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {
    this.getSkills();
    if ( this.getdata.content.skills_id !== '' && this.getdata.content.skills_id != null) {
      console.log(this.getdata)
      this.defaultSelectSkill = this.getdata.content.skills_id.split(',');
      console.log(this.defaultSelectSkill)
    }
  }

  getSkills() {
    this.apiService.getRequest(this.getdata.api_url + this.getdata.all_skill)
      .subscribe(responseData => {
        this.skillists = responseData['body'];
      });
  }

  saveJobSkills() {
    this.errorMsg = '';
    this.errorMsgArr = [];
    if (this.jobSkillEditForm.valid) {
      const params = {
        'id': this.getdata.user_id,
        'email': this.getdata.email,
        'profile': {
          'offer_skill': this.skillstring,
          'category_skill': this.skillidstring
        }
      };

      this.apiService.putRequest(this.getdata.api_url + this.getdata.update_url + this.getdata.user_id, params ).subscribe(
          data => {
            this.responseData = data;
            if (this.responseData.body !== '') {
              this.dialogRef.close({'status': 'success',
                'content': {
                  'skills': this.skillstring,
                  'skill_ids': this.skillidstring,
                }
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
      return this.jobSkillEditForm.controls[field].hasError('required') ? 'Field is required' : '';
  }

  onChangeSkills(event) {
    console.log(this.getdata.content);
    this.skillscreate = [];
    this.skillsidcreate = [];
    event.forEach(element => {
      if (element.id == null) {
        const params = {
          'name': element.name,
          'category': this.getdata.content.category_id,
          'status': 'Active'
      };
        const skillcreateURL = this.getdata.api_url + this.getdata.skill_url;
        this.apiService.postRequest(skillcreateURL, params).subscribe(
          row => {
            this.resultSkill = row;
            this.skillscreate.push(this.resultSkill.name);
            this.skillstring = this.skillscreate.toString();
            this.skillsidcreate.push(this.resultSkill.id);
            this.skillidstring = this.skillsidcreate.toString();
          },
        err => {
          console.log(err);
        });
      } else {
        this.skillscreate.push(element.name);
        this.skillstring = this.skillscreate.toString();
        this.skillsidcreate.push(element.id);
        this.skillidstring = this.skillsidcreate.toString();
      }
    });
  }

}
