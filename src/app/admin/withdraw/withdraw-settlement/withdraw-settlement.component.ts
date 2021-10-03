import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { ApiService } from '../../../services/api/api.service';
import { constant } from '../../../../data/constant';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-withdraw-settlement',
  templateUrl: './withdraw-settlement.component.html',
  styleUrls: ['./withdraw-settlement.component.css']
})
export class WithdrawSettlementComponent implements OnInit {
  
  withdrawForm: FormGroup;
  responseData: any = [];
  // error message
  errorMsg = '';
  errorMsgArr: any = [];
  settlement_amount:any;
  gettype: any;

  constructor(
  	formBulider: FormBuilder,
	private apiService: ApiService,
	public dialogRef: MatDialogRef<WithdrawSettlementComponent>,
	private router: Router,
	@Inject(MAT_DIALOG_DATA) public getdata: any,
	) { 
		this.withdrawForm = formBulider.group({
	      'date': [this.getdata.date, Validators.compose([Validators.required])],
	      'notes': [this.getdata.notes]
	    });
	
	}

  ngOnInit() {
  	this.settlement_amount = (this.getdata.amount).toFixed(2);
  	this.gettype = this.getdata.type;
  }

  saveWithdraw(formData) {
    this.errorMsg = '';
    this.errorMsgArr = [];
    if (this.withdrawForm.valid) {
     let dformat = moment(formData.date).format("YYYY-MM-DD");
		const params = {
	      'created_by': this.getdata.user_id,
	      'amount': (this.getdata.amount).toFixed(2),
	      'user': this.getdata.freelancer,
	      'withdraw': this.getdata.withdraw_id,
	      'notes': formData.notes,
	      'date': dformat,
	      'settlement_type': this.getdata.type
	    };
	    if (this.getdata.type == 'bank'){
	    	var urlapi = constant.apiurl + constant.getSettlement;
	    }else{
	    	var urlapi = constant.apiurl + constant.paypalSettlement;
	    }
	    this.apiService.postRequest(urlapi, params ).subscribe(
	      data => {
	        this.responseData = data;
	        if (this.responseData.body !== '') {
	          this.dialogRef.close({'status': 'success'});
	          this.router.navigate(['/admin/user/withdraws']);
	        }
	      }, err => {
	        console.log(err);
	    });
    } else {
      this.errorMsg = 'error';
    }
  }

  geterrorwithdrawMsg(field) {
    return this.withdrawForm.controls[field].hasError('required') ? 'Field is required' : '';
  }

  onclickcancel() {
    this.dialogRef.close('cancel');
  }

}
