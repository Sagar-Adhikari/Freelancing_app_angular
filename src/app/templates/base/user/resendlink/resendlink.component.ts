import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { constant } from '../../../../../data/constant';
import { ApiService } from '../../../../services/api/api.service';
import { UserService } from '../../../../services/sync/user.service';

@Component({
  selector: 'app-resendlink',
  templateUrl: './resendlink.component.html',
  styleUrls: ['./resendlink.component.css']
})
export class ResendlinkComponent implements OnInit {

  rForm: FormGroup;
  isbuttondisable = false;
  isloader= false;
  post: any;
  resForgot: any;

  // validation message display
  errorMsg = '';
  errorMsgArr: any;
  userLocation: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
    private snackBar: MatSnackBar,
    private userservice: UserService
  ) {
     this.rForm = fb.group({
      'email' : [null, Validators.compose([Validators.required, Validators.email])],
      });
  }

  ngOnInit() {
  }

  loginSubmit(post) {
    this.errorMsg = '';
    this.errorMsgArr = [];
    if (this.rForm.valid) {

      this.apiService.postRequest(constant.apiurl + constant.resendEmailVerificationLink, {'email': post.email}).subscribe(
        data => {
          this.userservice.snackMessage('Email verification link has been sent to your mail address. Please check & verify');
            this.router.navigateByUrl('/login');
        }, err => {
          this.errorMsg = 'error';
          this.errorMsgArr['email'] = 'Email not found';
        });
    } else {
      this.errorMsg = 'error';
          this.isbuttondisable = true;
          setTimeout(() => {
            this.isbuttondisable = false;
          }, 2000);
    }
  }

  geterrorMsg(field) {
    if (field === 'email' ) {
      return this.rForm.controls[field].hasError('required') ? 'Field is required' :
      this.rForm.controls[field].hasError('email') ? 'Please enter valid email address' : '';
    }
  }

}