import { Component, OnInit, ElementRef, ViewChild, HostListener, Inject } from '@angular/core';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
    ReactiveFormsModule,
    FormsModule,
    FormGroup,
    FormControl,
    Validators,
    FormBuilder
} from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { user } from '../../../../../model/user';
import { constant } from '../../../../../data/constant';
import { ApiService } from '../../../../services/api/api.service';
import { UserService } from '../../../../services/sync/user.service';
import * as crypto from 'crypto-js';
import { Title, Meta, DOCUMENT }     from '@angular/platform-browser';
import { NgxCarousel } from 'ngx-carousel';
import { country } from '../../../../../data/country';

@Component({
  selector: 'app-register',
  animations: [
    trigger(
      'registerAnimation',
      [
        transition(
        ':enter', [
          style({transform: 'translateX(100%)', opacity: 0}),
          animate('500ms', style({transform: 'translateX(0)', 'opacity': 1}))
        ]
      ),
      transition(
        ':leave', [
          style({transform: 'translateX(0)', 'opacity': 1}),
          animate('500ms', style({transform: 'translateX(100%)', 'opacity': 0})),
          
        ]

      )]
    )
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  is_step_1:boolean = true;
  is_step_2:boolean = false;
  public carouselOne: NgxCarousel;
  rForm: FormGroup;
  // firstname: FormControl;
  // lastname: FormControl;
  // email: FormControl;
  isloader:boolean= false;
  ismessage: Boolean = false;
  isbuttondisable: Boolean = false;
  errormessage: String;
  user_email:any;
  user_firstname:any;
  user_lastname:any;
  countries: any = country.list;
  result:any; 
  @ViewChild('freelancer_username') f_name:any;
  @ViewChild('freelancer_code') f_code:any;
  constructor(private fb: FormBuilder,private route: ActivatedRoute,private apiService: ApiService, private usersService:UserService,@Inject(DOCUMENT) private document: HTMLDocument) { 

   if(this.is_step_1==true){
      this.rForm = fb.group({
        'email': [null, Validators.compose([Validators.required, Validators.email])],
        'firstname': [null, Validators.compose([Validators.required])],
        'lastname': [null, Validators.compose([Validators.required])],
        'user_country':'',
        'user_password':'',
        // 'user_type':'',
        'user_name':''
      });
    }


    if(this.is_step_2==true){
     this.rForm = fb.group({
         'email': [null, Validators.compose([Validators.required, Validators.email])],
        'firstname': [null, Validators.compose([Validators.required])],
        'lastname': [null, Validators.compose([Validators.required])],
        'user_country': [null, Validators.compose([Validators.required])],
        'user_password': [null, Validators.compose([Validators.required])],
        // 'user_type': [null, Validators.compose([Validators.required])],
        'user_name': [null, Validators.compose([Validators.required])],
      });
    }

  }

  ngOnInit() {
    
    this.carouselOne = {
      grid: {xs: 1, sm: 1, md: 1, lg: 1, all: 0},
      slide: 1,
      speed: 400,
      interval: 4000,
      point: {
        visible: true
      },
      load: 1,
      touch: true,
      loop: true,
      custom: 'banner'
    }
  }

  step1Submit(post) {
    if (this.rForm.valid) {
       this.apiService.postRequest(constant.apiurl + constant.email_verify,{email:post.email}).subscribe(
            data => {
              this.result = data; 
              if(this.result.status){
                this.errormessage = 'This email is already in use';
                this.ismessage = true;
                this.isloader = false;
                this.isbuttondisable = true;
                setTimeout(() => {
                  this.ismessage = false;
                  this.isbuttondisable = false;
                }, 2000);
              }else{
                this.is_step_1      = false;
                this.is_step_2      = true;
                this.user_email     = post.email;
                this.user_firstname = post.firstname;
                this.user_lastname  = post.lastname;
              }
          }
      );
    } else {
      this.getFormMessage();
      this.showError();
    }
  }

  step2Submit(){}

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
    this.isbuttondisable = true;
    this.ismessage = true;
    setTimeout(() => {
      this.ismessage = false;
      this.isbuttondisable = false;
    }, 2000);
  }

  

}
