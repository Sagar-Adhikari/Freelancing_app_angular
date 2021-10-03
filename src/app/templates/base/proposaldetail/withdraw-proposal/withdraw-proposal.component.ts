import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api/api.service';
import { constant, inputData } from '../../../../../data/constant';
import { UserService } from '../../../../services/sync/user.service';

@Component({
  selector: 'app-withdraw-proposal',
  templateUrl: './withdraw-proposal.component.html',
  styleUrls: ['./withdraw-proposal.component.css']
})
export class WithdrawProposalComponent implements OnInit {
  withdrawProposalForm: FormGroup;
  loggedUserType =  localStorage.getItem('user_type');
  reasons:any;
  // error message
  errorMsg = '';
  errorMsgArr: any = [];
  responseData:any;
  proposal_id:any;
  userID = this.apiService.decodejwts().userid; // logged user id
  userText:any;
  constructor(formBulider: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private router: Router,
    public dialogRef: MatDialogRef<WithdrawProposalComponent>,
    @Inject(MAT_DIALOG_DATA) public getdata: any,
    private userservice: UserService) {
    this.withdrawProposalForm = formBulider.group({
      'message': ['', Validators.compose([Validators.required])],
      'reason': ['', Validators.compose([Validators.required])],
      'is_block': [false]
    });
  }

  ngOnInit() {
    if(this.loggedUserType == 'Freelancer'){
      this.reasons = inputData.withdrawFreelancerReasons;
      this.userText = 'client';
    }else{
      this.reasons = inputData.withdrawClientReasons;
      this.userText = 'freelancer';
    }
    this.proposal_id = this.getdata.proposal_id;
  }
  saveWithdraw(formData) {
    if (this.withdrawProposalForm.valid) {
      const params = {
        'message' : formData.message,
        'reason' : formData.reason,
        'is_block' : formData.is_block,
        'user': this.userID,
        'proposal': this.proposal_id
      }
      this.apiService.postRequest(constant.apiurl + constant.withdrawProposal, params ).subscribe(
        data => {
          this.responseData = data;
          if (this.responseData.id) {
            this.router.navigate(['myproposal']);
            this.userservice.snackMessage('Your proposal has been withdrawn successfully');
            this.dialogRef.close('success');
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
    return this.withdrawProposalForm.controls[field].hasError('required') ? 'Field is required' : '';
  }

}
