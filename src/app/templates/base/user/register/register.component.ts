import { Component, OnInit, Inject } from '@angular/core';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { user } from '../../../../../model/user';
import { constant } from '../../../../../data/constant';
import { ApiService } from '../../../../services/api/api.service';
import { UserService } from '../../../../services/sync/user.service';
import * as crypto from 'crypto-js';
import { Title, Meta, DOCUMENT } from '@angular/platform-browser';
import { country } from '../../../../../data/country';
import { Register2Component } from '../../user/register2/register2.component';

@Component({
  selector: 'app-register',
  // directives: [Register2Component],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  user_id: string = this.apiService.decodejwts().userid;
  is_step_1 = true;
  is_step_2 = false;
  rForm: FormGroup;
  isloader= false;
  ismessage: Boolean = false;
  isbuttondisable: Boolean = false;
  errormessage: string;
  public user_email: any;
  public user_firstname: any;
  public user_lastname: any;
  countries: any = country.list;
  result: any;

  // validation message display
  errorMsg = '';
  errorMsgArr: any;

  constructor( private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private usersService: UserService,
    @Inject(DOCUMENT) private document: HTMLDocument
  ) {
    this.rForm = fb.group({
      'email': [null, Validators.compose([Validators.required, Validators.email])],
      'firstname': [null, Validators.compose([Validators.required])],
      'lastname': [null, Validators.compose([Validators.required])]
    });

  }

  ngOnInit() {
    if(this.user_id !== undefined){
      location.replace(constant.siteBaseUrl)
      return false;
    }
  }

  step1Submit(post) {
    this.errorMsg = '';
    this.errorMsgArr = [];
    if (this.rForm.valid) {
  
      if(post.email.replace(/[^A-Z]/g, "").length !== 0){
        this.errorMsg = 'error';
        this.errorMsgArr['email'] = ['Uppercase in email ID not Allowed'];
        this.errormessage = 'Uppercase in email ID not Allowed';
          return false;
      }
       this.apiService.postRequest(constant.apiurl + constant.email_verify, { email: post.email.toLowerCase()}).subscribe(
            data => {
              this.result = data;
              if (this.result.status) {
                this.errorMsg = 'error';
                this.errorMsgArr['email'] = ['This email is already in use'];
                this.errormessage = ' This email is already in use';
                // this.ismessage = true;
                this.isloader = false;
                this.isbuttondisable = true;
                setTimeout(() => {
                  // this.ismessage = false;
                  this.isbuttondisable = false;
                }, 2000);
              } else {
                this.is_step_1      = false;
                this.is_step_2      = true;
                this.user_email     = post.email.toLowerCase();
                this.user_firstname = post.firstname;
                this.user_lastname  = post.lastname;
                this.router.navigateByUrl('register2/'
                + this.user_firstname + '/' + this.user_lastname + '/' + this.user_email, { skipLocationChange: true });
                // this.router.navigateByUrl("register2");
              }
          }
      );
    } else {
      this.getFormMessage();
      this.showError();
    }
  }

  getFormMessage() {
    if (this.rForm.controls['email'].hasError('required')
    || this.rForm.controls['firstname'].hasError('required')
    || this.rForm.controls['lastname'].hasError('required')) {
      this.errormessage = 'Fields are required';
    } else if (this.rForm.controls['email'].hasError('email')) {
      this.errormessage = 'Invalid email';
    }
  }

   showError() {
    this.errorMsg = 'error';
    this.isbuttondisable = true;
    // this.ismessage = true;
    setTimeout(() => {
      // this.ismessage = false;
      this.isbuttondisable = false;
    }, 2000);
  }

  geterrorMsg(field) {
    if (field == 'email' ) {
      return this.rForm.controls[field].hasError('required') ? 'Field is required' :
      this.rForm.controls[field].hasError('email') ? 'Please enter valid email address' : '';
    } else {
      return this.rForm.controls[field].hasError('required') ? 'Field is required' : '';
    }
  }

}
