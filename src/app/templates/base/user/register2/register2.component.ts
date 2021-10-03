import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { user } from '../../../../../model/user';
import { constant } from '../../../../../data/constant';
import { ApiService } from '../../../../services/api/api.service';
import { UserService } from '../../../../services/sync/user.service';
import * as crypto from 'crypto-js';
import { Title, Meta, DOCUMENT } from '@angular/platform-browser';
import { country } from '../../../../../data/country';
import { INFERRED_TYPE } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-register2',
  animations: [
    trigger(
      'registerAnimation',
      [
        transition(
          ':enter', [
            style({ transform: 'translateX(100%)', opacity: 0 }),
            animate('500ms', style({ transform: 'translateX(0)', 'opacity': 1 }))
          ]
        ),
        transition(
          ':leave', [
            style({ transform: 'translateX(0)', 'opacity': 1 }),
            animate('500ms', style({ transform: 'translateX(100%)', 'opacity': 0 })),
          ]

        )]
    )
  ],
  templateUrl: './register2.component.html',
  styleUrls: ['./register2.component.css']
})

  /*
  * Page : /registration
  * Decription : registration second page
  * Modified Date : 05/06/2018
  * Created By : Daniel
  * Modified By : Ananth
  * Author : Bsetec
  */
export class Register2Component implements OnInit {
  user_id: string = this.apiService.decodejwts().userid;
  is_step_1 = true;
  is_step_2 = false;
  rgForm: FormGroup;
  isloader = false;
  ismessage: Boolean = false;
  isbuttondisable: Boolean = false;
  errormessage: string;
  user_email: any;
  user_firstname: any;
  user_lastname: any;
  user_type = 'Hire';
  params: any;
  click_type = 1;
  countries: any = country.list;
  result: any;
  usernameDisplay = false;
  siteUrl:string = constant.siteBaseUrl;
  @ViewChild('freelancer_username') f_name: any;
  // @ViewChild('freelancer_code') f_code:any;

   // validation message display
   errorMsg = '';
   errorMsgArr: any;
  clientcurrentlocation:string;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private usersService: UserService,
    @Inject(DOCUMENT) private document: HTMLDocument,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
      this.rgForm = fb.group({
        'user_country': [null, Validators.compose([Validators.required])],
        'user_password': [null, Validators.compose([Validators.required])],
        'user_name': null,
        'send_mail': true,
        'agree': [false, Validators.compose([Validators.requiredTrue])],
      });
  }

  ngOnInit() {
    if(this.user_id !== undefined){
      location.replace(constant.siteBaseUrl)
      return false;
    }
    this.getcurrentlocation();
    this.route.params.subscribe(params => {
      this.user_email = params['email'];
      this.user_firstname = params['first_name'];
      this.user_lastname = params['last_name'];
    });

  }
  // getcurrentlocation(){
  //   this.apiService.getRequest("http://ip-api.com/json").subscribe(data=>{
  //     this.clientcurrentlocation = data['body'].countryCode;
  //   });
  // }
  getcurrentlocation(){
    this.clientcurrentlocation = 'NP';
  }
  step2Submit(post) {
    this.errorMsg = '';
    this.errorMsgArr = [];

    if (this.rgForm.valid) {
      if (this.user_type === 'Work') {
        this.params = {
          email: this.user_email.toLowerCase(),
          password1: post.user_password,
          password2: post.user_password,
          first_name: this.user_firstname,
          last_name: this.user_lastname,
          register_type: this.user_type,
          country: 'NP',
          send_mail: post.send_mail,
          username: post.user_name
        };
      } else {
        this.params = {
          email: this.user_email.toLowerCase(),
          password1: post.user_password,
          password2: post.user_password,
          first_name: this.user_firstname,
          last_name: this.user_lastname,
          register_type: this.user_type,
          country: post.user_country,
          send_mail: post.send_mail,
        };
        console.log(this.params);
      }
      console.log(this.params);
      this.apiService.postRequest(constant.apiurl + constant.register, this.params).subscribe(
        data => {
          this.result = data;
          this.router.navigateByUrl('login');
          this.usersService.snackMessage('Register successful. Please verify you email address by following the link we have mailed you.');
        }, err => {
          if (err.error.email) {
            // this.errormessage = err.error.email['0'];
          } else if (err.error.username) {
            // this.errormessage = err.error.username['0'];
            this.errorMsg = 'error';
            this.errorMsgArr['user_name'] = err.error.username['0'];
          } else if (err.error.password1) {
            this.errorMsg = 'error';
            this.errorMsgArr['user_password'] = err.error.password1['0'];
            // this.errormessage = err.error.password1['0'];
          } else {
            this.ismessage = true;
            this.errormessage = 'Register Failed,Please try again later';
          }
          this.isloader = false;
          this.isbuttondisable = true;
          setTimeout(() => {
            this.ismessage = false;
            this.isbuttondisable = false;
          }, 2500);
        }
      );
    } else {
      // this.getFormMessage();
      this.showError();
    }
  }

  actionbtn(r_type: any) {
    // const fname = this.f_name.nativeElement as HTMLElement;
    // let fcode = this.f_code.nativeElement as HTMLElement;
    this.click_type = r_type;
    if (r_type === 2) {
      this.user_type = 'Work';
      // fname.style.display = 'block';
      this.usernameDisplay = true;
      // add username validation dynamically
      this.rgForm.get('user_name').setValidators([Validators.required, Validators.minLength(2)]);
      this.rgForm.get('user_name').updateValueAndValidity();
      // fcode.style.display = "block";
    } else {
      this.user_type = 'Hire';
      // fname.style.display = 'none';
      this.usernameDisplay = false;
      this.rgForm.get('user_name').clearValidators();
      this.rgForm.get('user_name').updateValueAndValidity();
      // fcode.style.display = "none";
    }
  }

  // getFormMessage() {
  //   if (this.rgForm.controls['user_country'].hasError('required')) {
  //     this.errormessage = 'Country field is required';
  //   } else if (this.rgForm.controls['user_password'].hasError('required')) {
  //     this.errormessage = 'Password field is required';
  //   } else if (this.rgForm.controls['user_name'].hasError('required') || this.rgForm.controls['user_name'].hasError('minlength')) {
  //     this.errormessage = 'Username field is required';
  //   } else if (this.rgForm.controls['agree'].hasError('required')) {
  //     this.errormessage = 'Please accept term & condition';
  //   }
  // }

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
    if (field == 'user_name' &&  this.user_type == 'Work') {
      return this.rgForm.controls[field].hasError('required') ?
      'Field is required' : this.rgForm.controls[field].hasError('minlength') ? 'Please enter valid username' : '';
    } else if (field == 'agree') {
      return this.rgForm.controls[field].hasError('required') ? 'Please accept term & condition' : '';
    } else {
      return this.rgForm.controls[field].hasError('required') ? 'Field is required' : '';
    }
  }
}
