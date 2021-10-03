import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { constant } from '../../../../../data/constant';
import { ApiService } from '../../../../services/api/api.service';
import { UserService } from '../../../../services/sync/user.service';

@Component({
  selector: 'app-forgetpasswordcomplete',
  templateUrl: './forgetpasswordcomplete.component.html',
  styleUrls: ['./forgetpasswordcomplete.component.css']
})
export class ForgetpasswordcompleteComponent implements OnInit {
  uid: string;
  token: string;
  forgetForm: FormGroup;
  resForgot: any;
  isbuttondisable = false;
  // validation message display
  errorMsg = '';
  errorMsgArr: any;
  userLocation: any;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private snackBar: MatSnackBar,
    private userservice: UserService,
    private route: ActivatedRoute,
  ) { 
    this.uid = this.route.snapshot.paramMap.get('uid');
    this.token = this.route.snapshot.paramMap.get('token');
    this.forgetForm = fb.group({
      'password' : [null, Validators.compose([Validators.required])],
      'confirm_password' : [null, Validators.compose([Validators.required])],
      },);
  }

  ngOnInit() {
    console.log(this.uid);
    console.log(this.token);
  }

  passwordSubmit(post) {
    this.errorMsg = '';
    this.errorMsgArr = [];
    if (this.forgetForm.valid) {
      if (post.password !== post.confirm_password) {
        this.errorMsg = 'error';
        this.userservice.snackErrorMessage('Password & Confirm Password are not same!');
        this.geterrorMsg['password'] = 'Password not same';
        return false;
      } else {
        const params = {
          'new_password1' : post.new_password,
          'new_password2' : post.confirm_password
        };
        this.apiService.putRequest(constant.apiurl + constant.forgetpasswordcomplete, {'password': post.password,'uidb64': this.uid,'token':this.token}).subscribe(
          data => {
            this.userservice.snackMessage('New Password created');
            this.router.navigateByUrl('/login');
          }, err => {
            this.errorMsg = 'error';
            this.errorMsgArr['password'] = 'error in creating new password';
            if (err != '') {
              if (err.error.new_password2 != '' && typeof err.error.new_password2 != 'undefined')  {
                this.geterrorMsg['password'] = err.error.new_password2[0];
              }
              if (err.error.new_password1 != '' && typeof err.error.new_password1 != 'undefined')  {
                this.geterrorMsg['password'] = err.error.new_password1[0];
              }
            }
        });
      }
    } else {
      this.errorMsg = 'error';
    }
  }

  geterrorMsg(field) {
    if (field === 'password' || field === 'confirm_password' ) {
      return this.forgetForm.controls[field].hasError('required') ? 'Field is required' :
      this.forgetForm.controls[field].hasError('password') ? 'field is required' : '';
    }
  }

}
