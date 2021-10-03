/*
 * Page : Client Feedback Form
 * Use: This page only used to submit the feedback to client
 * Functionality :
 *  >> Create the angular material form
 *  >> Fetch the data's from APIs
 *  >> Saved the freelancer given feedback to backend
 * Created Date : 05/01/2019
 * Updated Date : 07/01/2019
 * Copyright : Bsetec
 */
import { Component, OnInit, HostListener } from '@angular/core';
import { ApiService } from '../../../services/api/api.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { constant } from '../../../../data/constant';
import { FormBuilder, FormGroup, Validators, FormControl, DefaultValueAccessor, FormArray } from '@angular/forms';
import * as moment from 'moment';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from '../../../services/sync/user.service';

@Component({
  selector: 'app-client-feedback',
  templateUrl: './client-feedback.component.html',
  styleUrls: ['./client-feedback.component.css']
})
export class ClientFeedbackComponent implements OnInit {
  //client feedback form name
  clientfeedbackForm: FormGroup;
  isbuttondisable: boolean = false;
  errorMsg: boolean = false;
  //reason dropdown values
  reasons = [
    { 'key': '1', 'name': 'Job completed successfully' },
    { 'key': '2', 'name': 'Client no longer needed this work done' },
    { 'key': '3', 'name': 'I was unable to meet deadlines or job requirements ' },
    { 'key': '4', 'name': 'Another reason' },
    { 'key': '5', 'name': 'I\'m not sure' }
  ];
  ismessage: boolean = false;
  cooperation = 0;
  skills = 0;
  availability = 0;
  quality = 0;
  deadlines = 0;
  communication = 0;
  total_score: any = '0.00';
  final_score: number;
  client_id: any;
  initialData: any;
  initialProfileData: any;
  client_name: any;
  private_star_rating = 0;
  contract_id: any;
  contract_status: any;
  constructor(private apiService: ApiService, private router: Router,
    private route: ActivatedRoute, private fb: FormBuilder, public dialog: MatDialog, private DomSan: DomSanitizer, private syncVar: UserService) {
    this.client_id = this.route.snapshot.paramMap.get('id');
    this.contract_id = this.route.snapshot.paramMap.get('contract_id');
    this.contract_status = this.route.snapshot.paramMap.get('contract_status');
    this.clientfeedbackForm = fb.group({
      'private_reason': [null, Validators.compose([Validators.required])],
      'private_rating': [null],
      'public_cooperation': [null],
      'public_skills': [null],
      'public_availability': [null],
      'public_quality': [null],
      'public_deadlines': [null],
      'public_communication': [null],
      'public_reason': [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
    });
    this.getUserdetails();//used to get the client details 
  }

  ngOnInit() {

  }
  /** This function is used to validate the whitespace in the from */
  noWhitespaceValidator(control: FormControl) {
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true }
  }

  /** This function is used for get data's from API and display to the form */
  getUserdetails() {
    this.apiService.getRequest(constant.apiurl + constant.get_user_details + this.client_id + '/').subscribe(
      data => {
        this.initialData = data;
        if (this.initialData.status === 200) {
          this.initialProfileData = this.initialData.body;
          if (
            this.initialProfileData.profile.user_type == 'Freelancer') {
            this.router.navigate(['/freelancerprofile']);
          } else {
            this.client_name = this.initialProfileData.first_name + ' ' + this.initialProfileData.last_name;
          }
        }

      }, err => {
        console.log(err);
      });
  }

  /** This function is used to save the feedback to backend */
  savefeedbackSubmit(formData) {

    this.errorMsg = false;
    if (this.clientfeedbackForm.valid) {
      if(this.contract_status == 'closed'){
        this.contract_status = 'Closed'
      }
      var href = constant.apiurl + constant.save_client_feedback;
      var datas = {
        client: this.client_id,
        freelancer: this.apiService.decodejwts().userid,
        status: this.contract_status,
        description: formData.public_reason,
        rate: this.total_score,
        availability: (formData.public_availability) ? formData.public_availability : 0,
        communication: (formData.public_communication) ? formData.public_communication : 0,
        cooperation: (formData.public_cooperation) ? formData.public_cooperation : 0,
        deadlines: (formData.public_deadlines) ? formData.public_deadlines : 0,
        quality: (formData.public_quality) ? formData.public_quality : 0,
        skills: (formData.public_skills) ? formData.public_skills : 0,
        private_rating: (formData.private_rating) ? formData.private_rating : 0,
        private_reason: formData.private_reason,
        contract: this.contract_id
      };
      this.apiService.postRequest(href, datas).subscribe(result => {
      }, error => {
        console.log('something went wrong.');
      }, () => {
        if (this.contract_status == 'closed') {
          this.syncVar.snackMessage('Contract has been closed successfully.');
        } else {
          this.syncVar.snackMessage('Feedback has been added successfully.');
        }
        this.router.navigate(['/my-contract']);
      });
    } else {
      this.errorMsg = true;
    }
  }

  /** This function is used to display the error message */
  geterrorMsg(field) {
    if (field == 'public_reason') {
      return (this.clientfeedbackForm.controls[field].hasError('required') || this.clientfeedbackForm.controls[field].hasError('whitespace')) ? 'Field is required' : '';
    } else {
      return this.clientfeedbackForm.controls[field].hasError('required') ? 'Field is required' : '';
    }
  }

  /** This function is used to convert the multiple rating to single ration to display the feedback from */
  getRating() {
    this.final_score = ((this.cooperation + this.skills + this.availability + this.quality + this.deadlines + this.communication) / 6);
    this.total_score = this.round(this.final_score, 1).toFixed(2);
  }

  /** This function is used to convert round value */
  round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

  /** This function is used to redirect the page */
  onCancel() {
    this.router.navigate(['/freelancerprofile']);
  }

}
