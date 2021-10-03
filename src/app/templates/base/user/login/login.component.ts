import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { user } from '../../../../../model/user';
import { constant } from '../../../../../data/constant';
import { ApiService } from '../../../../services/api/api.service';
import { UserService } from '../../../../services/sync/user.service';
import * as crypto from 'crypto-js';
import { Title, Meta, DOCUMENT } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user_id: string = this.apiService.decodejwts().userid;
  header: any;
  payload: any;
  rForm: FormGroup;
  ismessage = false;
  isbuttondisable = false;
  isloader= false;
  post: any;
  result: any;
  usermodel: user;
  errormessage: string;
  displayResendVerificationLink: boolean = false;

  // validation message display
  errorMsg = '';
  errorMsgArr: any;
  userLocation: any;
  colorpassicon = false;
  successMsg: string;
  profileDetails: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private usersService: UserService,
    @Inject(DOCUMENT) private document: HTMLDocument,
    private router: Router
  ) {
    this.successMsg = this.route.snapshot.paramMap.get('verify_email');
    this.route.queryParams.subscribe(params => {
      this.successMsg = params['verify_email'];
      if(this.successMsg == 'true'){
        this.usersService.snackMessage('Email Verified');
      } else if (this.successMsg == 'false'){
        this.usersService.snackMessage('Activation link invalid');
      }
  });
  
     this.rForm = fb.group({
      'email' : [null, Validators.compose([Validators.required])],
      'password' : [null, Validators.compose([Validators.required, Validators.minLength(5),])]
      });
  }

  ngOnInit() {
    if (this.user_id !== undefined) {
      location.replace(constant.siteBaseUrl);
      return false;
    }
    this.successMsg = this.route.snapshot.paramMap.get("message");
  }

  changetype() {
    if (this.document.getElementById('login_password').getAttribute('type') === 'password') {
      this.document.getElementById('login_password').setAttribute('type', 'text');
      this.colorpassicon = true;
    } else {
      this.document.getElementById('login_password').setAttribute('type', 'password');
      this.colorpassicon = false;
    }
  }

  loginSubmit(post) {
    this.errorMsg = '';
    this.errorMsgArr = [];
    this.displayResendVerificationLink = false;
    if (this.rForm.valid) {

      this.loginAPI(constant.apiurl + constant.login, {email: post.email, password: post.password});
    } else {
      this.errorMsg = 'error';
      // this.getFormMessage();
          this.isbuttondisable = true;
          // this.ismessage = true;
          setTimeout(() => {
            // this.ismessage = false;
            this.isbuttondisable = false;
          }, 2000);
    }
  }

  // getFormMessage () {
  //    if (this.rForm.controls['email'].hasError('required') || this.rForm.controls['password'].hasError('required')) {
  //       this.errormessage = 'Fields are required';
  //    }  else if (this.rForm.controls['email'].hasError('email')) {
  //       this.errormessage =  'Invalid email';
  //    } else if (this.rForm.controls['password'].hasError('minlength') || this.rForm.controls['password'].hasError('maxlength')) {
  //       this.errormessage = 'Password must be between 5 to 25 characters';
  //    }
  // }

  geterrorMsg(field) {
    if (field === 'email' ) {
      return this.rForm.controls[field].hasError('required') ? 'Field is required' : '';
    } else if (field === 'password' ) {
      if(this.rForm.controls[field].hasError('required')){
        return 'Field is required';
      }else if(this.rForm.controls[field].hasError('minlength')
      || this.rForm.controls[field].hasError('maxlength')){
        return 'Please enter valid password';
      }else{
        return '';
      }
    }
  }

  loginAPI(url, params: any) {
      this.isloader = true;
      this.isbuttondisable = true;
      this.apiService.postRequest(url, params).subscribe(
            data => {
              this.result = data;
              this.saveUser(this.result.user, this.result.token);
               this.usersService.topheader.subscribe(userType => {
                if(this.apiService.decodejwts().userid === undefined || this.apiService.decodejwts().userid == null){
                  return;
                }                  
                if(this.profileDetails == null)
                {                  
                  const queryUserID = this.apiService.decodejwts().userid + '/';
                  this.apiService.getRequest(constant.apiurl + constant.updateUserDetails + queryUserID).subscribe(
                    row => {
                      this.profileDetails = row['body'];
                      this.userLocation = this.profileDetails.profile.location;
                      if (this.profileDetails != '') {
                        const usertype = this.profileDetails.profile.user_type;
                        localStorage.setItem('user_type', usertype);
                        if (usertype === 'Admin') {
                          this.router.navigateByUrl('/admin/dashboard');
                        } else if (usertype === 'Freelancer') {
                          if ( this.profileDetails.profile.category == null || this.profileDetails.profile.category === '' || this.profileDetails.profile.category === 'None' ) {
                            this.router.navigate(['/user/basic']);
                          } else if (
                            this.profileDetails.profile.category !== '' &&
                            this.profileDetails.profile.category != null && this.profileDetails.profile.category != 'None' &&
                            ( this.profileDetails.profile.title === '' || this.profileDetails.profile.title == null) ) {
                            this.router.navigate(['/freelancer/more']);
                          } else if (
                            this.profileDetails.profile.category !== '' &&
                            this.profileDetails.profile.category != null && this.profileDetails.profile.category != 'None' &&
                            this.profileDetails.profile.title !== '' && this.profileDetails.profile.title != null ) {
                                this.router.navigate(['/freelancerprofile']);    
                          }else{
                            this.router.navigate(['/freelancerprofile']);
                          }
                        } else {
                          const clientusertype = this.profileDetails.profile.user_type;
                          if (clientusertype === 'Client') {
                            if ( this.profileDetails.profile.company_employees == null || this.profileDetails.profile.company_employees === '' ) {
                              this.router.navigate(['/profile/basic']);
                              return false;
                            } else {
                              this.router.navigateByUrl('/joblisting');
                              return false;
                            }
                          }
                        }
                      }
                    }, err => {
                      console.log(err);
                  });
                }
              });
               this.usersService.snackMessage('Login Successful');
            }, err => {
              console.log(err);
              if (err.error.non_field_errors) {
                this.errormessage = err.error.non_field_errors[0];
                if(this.errormessage == 'Account is not verified') {
                  //display link to verify email address
                  this.displayResendVerificationLink = true;
                }
              } else {
                this.errormessage = 'Login Failed,Please use valid email & password';
              }
              this.ismessage = true;
              this.isloader = false;
              this.isbuttondisable = true;
              setTimeout(() => {
                this.ismessage = false;
                this.isbuttondisable = false;
              }, 2000);
          });
  }

  saveUser(userDetails: any, api_token: any) {
    const header = {
      'typ': 'JWT',
      'alg': 'HS256',
    };
    const stringifiedHeader = crypto.enc.Utf8.parse(JSON.stringify(header));
    const encodedHeader = this.base64url(stringifiedHeader);
    const data = {
      'exp': Math.floor(Date.now() / 1000) + (60 * 60),
      'userid': userDetails.pk,
      'username': userDetails.username,
      'first_name': userDetails.first_name,
      'last_name': userDetails.last_name,
      'email': userDetails.email,
      'user_type': userDetails.user_type,
      'access_token': api_token,
      'membership_id': userDetails.membership_id,
      'has_card':userDetails.has_card
    };
    const stringifiedData = crypto.enc.Utf8.parse(JSON.stringify(data));
    const encodedData     = this.base64url(stringifiedData);
    const token           = encodedHeader + '.' + encodedData;
    const secret          = 'R5H9D5ZqEnneZUIRmhFZHkeKkY9SKAg9';
    const signature       = crypto.HmacSHA256(token, secret);
    // signature           = this.base64url(signature);
    const signedToken     = token + '.' + signature;
    localStorage.setItem('workplus_token', signedToken);
    localStorage.setItem('exp_token', api_token);
    localStorage.setItem('againreset', '1');
    this.usersService.userlogin('user');
  }

  base64url(source) {
    let encodedSource = crypto.enc.Base64.stringify(source);
    encodedSource = encodedSource.replace(/=+$/, '');
    encodedSource = encodedSource.replace(/\+/g, '-');
    encodedSource = encodedSource.replace(/\//g, '_');
    return encodedSource;
  }
}
