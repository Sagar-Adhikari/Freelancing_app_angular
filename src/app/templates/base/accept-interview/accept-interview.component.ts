import { Component, ChangeDetectorRef, Inject, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api/api.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { constant, inputData } from '../../../../data/constant';
import { FormBuilder, FormGroup, Validators, FormControl, DefaultValueAccessor, FormArray } from '@angular/forms';
import * as moment from 'moment';
import { ContractCategoryComponent } from '../contract/contract-category/contract-category.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject } from "rxjs/Subject";
import { UserService } from '../../../services/sync/user.service';
import {Location} from '@angular/common';
@Component({
  selector: 'app-accept-interview',
  templateUrl: './accept-interview.component.html',
  styleUrls: ['./accept-interview.component.css']
})
export class AcceptInterviewComponent implements OnInit {
  job_id: any;
  interview_id: any;
  acceptForm: FormGroup;
  data: any;
  result = [];
  errorMsg: boolean = false;
  cat: boolean = false;
  subcat: boolean = false;
  type: boolean = false;
  level: boolean = false;
  reason: boolean = false;
  //fileupload
  url = [];
  pushFiles = [];
  msgFiles = new FormData();
  file_info_all = [];
  uploadedFile = [];
  uploadinfo: any;
  project_hours = inputData.projectHours;
  save_result: any;
  private subject: Subject<string> = new Subject();
  isbuttondisable: boolean = false;
  isloader: boolean = false;
  display_data: boolean = false;
  constructor(private apiService: ApiService, private router: Router,
    private route: ActivatedRoute, private fb: FormBuilder, public dialog: MatDialog, private DomSan: DomSanitizer, private userservice: UserService, private _location: Location) {
    this.interview_id = this.route.snapshot.paramMap.get('id');
    this.getJobdetails();
    this.acceptForm = fb.group({
      'bid_amount': [null, Validators.compose([Validators.required])],
      'service_amount': [null, Validators.compose([Validators.required])],
      'receive_amount': [null, Validators.compose([Validators.required])],
      'description': [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'project_hour': [null, Validators.compose([Validators.required, this.noWhitespaceValidator])]
    });

    this.subject.debounceTime(500).subscribe(searchTextValue => {
      if (searchTextValue != '' && typeof searchTextValue != 'undefined') {
        var charge: any = 20;
        var web_amt: any = (parseFloat(searchTextValue) * parseFloat(charge)) / 100;
        var rc_amt = parseFloat(searchTextValue) - parseFloat(web_amt);
        this.acceptForm.patchValue({
          'service_amount': web_amt,
          'receive_amount': rc_amt
        });
      }
    });
  }

  ngOnInit() {

  }

  getJobdetails() {
    var href = constant.apiurl + constant.invite_job_details + this.interview_id;
    this.apiService.getRequest(href).subscribe(
      data => {
        this.display_data = true;
        this.data = data;
        this.job_id = this.data.body.job_detail.id;
        this.result.push(this.data.body);
      });
  }

  noWhitespaceValidator(control: FormControl) {
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true }
  }

  saveInterview(formData) {
    this.errorMsg = false;
    console.log(formData);
    if (this.acceptForm.valid) {
      var datas = {
        "cover_letter": formData.description,
        "bid_amount": formData.bid_amount,
        "expected_to_complete": formData.project_hour,
        "milestones_count": 0,
        "team_or_freelancer": 'Freelancer',
        "team_count": 0,
        // "status": 'Request',
        "status": 'Accept',
        "status_date": null,
        "attachments": "",
        "is_deleted": false,
        "user": this.apiService.decodejwts().userid,
        "job": this.job_id
      };
      if (this.url.length > 0) {
        this.doUploads().then(
          (val) => {
            datas['attachments'] = JSON.stringify(this.file_info_all);
            this.saveContracts(datas);
          }, (err) => { console.error(err); });
      } else {
        this.saveContracts(datas);
      }
    } else {
      this.errorMsg = true;
    }
  }

  saveContracts(datas: any) {
    this.apiService.postRequest(constant.apiurl + constant.job_proposal, datas).subscribe(
      data => {
        this.save_result = data;
        if (this.save_result.status) {
          this.isloader = false;
          this.isbuttondisable = true;
          setTimeout(() => {
            this.isbuttondisable = false;
          }, 2000);
          this.userservice.snackMessage('Proposal has been sent successfully.');
          this.router.navigate(['myproposal']);
        } else {
          this.userservice.snackErrorMessage('Something went wrong please try again.');
        }
      },
      error =>{
        if(error['error'].non_field_errors[0] === 'Proposal Already Exist'){
          this.userservice.snackMessage('Proposal Already Exist');
        }
      });
  }

  geterrorMsg(field) {
    if (field == 'bid_amount' && field == 'service_amount' && field == 'receive_amount') {
      return this.acceptForm.controls[field].hasError('required');
    } else {
      return (this.acceptForm.controls[field].hasError('required') || this.acceptForm.controls[field].hasError('whitespace')) ? 'Field is required' : '';
    }

  }

  onKeyUpamount(event) {
    this.subject.next(event.srcElement.value);
  }

  readUrl(event: any) {
    if (event.target.files.length > 0) {
      this.url.length = 0;
      this.pushFiles.length = 0;
      for (var i = event.target.files.length - 1; i >= 0; i--) {
        // this.msgFiles = new FormData();
        var file_ext = event.target.files[i].name.split('.').pop();
        var file_type = event.target.files[i].type;
        var file_size = event.target.files[i].size;
        var file_name = event.target.files[i].name;

        var img_type = ['image/gif', 'image/jpeg', 'image/jpg', 'image/png'];
        if (img_type.indexOf(file_type) > -1) {
          const u = (window.URL) ? window.URL.createObjectURL(event.target.files[i]) : (window as any).webkitURL.createObjectURL(event.target.files[i]);
          this.url.push({ 'img': this.DomSan.bypassSecurityTrustResourceUrl(u), 'size': event.target.files[i].size, 'file_name': event.target.files[i].name });

        }

        this.pushFiles.push(event.target.files[i]);
      }
    }
  }

  doUploads() {
    const rm = this.pushFiles.length - 1;
    var promise = new Promise((resolve, reject) => {
      if (this.url.length > 0) {
        const msgFiles = new FormData();
        for (var i = 0; i < this.pushFiles.length; i++) {
          this.msgFiles.append('file', this.pushFiles[i]);
          this.msgFiles.append('user', this.apiService.decodejwts().userid);
          this.msgFiles.append('type', 'Accept_Interview');
          this.msgFiles.append('file_name', this.pushFiles[i].name);
          this.msgFiles.append('file_ext', this.pushFiles[i].type);
          this.msgFiles.append('file_size', this.pushFiles[i].size);

          this.apiService.uploadFile(constant.apiurl + constant.fileupload, this.msgFiles).subscribe(
            data => {
              this.uploadinfo = data;
              this.file_info_all.push(this.uploadinfo);
              this.uploadedFile.push(this.uploadinfo.id);
            },
            err => {
              console.log('something went wrong');
            }
          );

          setTimeout(() => {
            resolve();
          }, 800);
        }
      }
    });

    return promise;
  }

  removefiles(id) {
    this.url.splice(id, 1);
    this.pushFiles.splice(id, 1);
  }

  onCancel() {
    this._location.back();
  }

}
