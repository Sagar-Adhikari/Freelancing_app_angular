import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { constant } from '../../../../../data/constant';
import { ApiService } from '../../../../services/api/api.service';
import { UserService } from '../../../../services/sync/user.service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit {
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
    this.errorMsg = this.route.snapshot.paramMap.get('verify_token');
    this.route.queryParams.subscribe(params => {
      this.errorMsg = params['verify_token'];
      if(this.errorMsg == 'false'){
        this.userservice.snackMessage('Token is not valid, please request a new one');
      } 
  });

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

      this.apiService.postRequest(constant.apiurl + constant.forgotpassword, {'email': post.email}).subscribe(
        data => {
          this.resForgot = data;
          if (this.resForgot.detail === 'Password reset e-mail has been sent.') {
            this.userservice.snackMessage('password email reset has been sent to your mail address. please check & login');
            this.router.navigateByUrl('/login');
          }
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