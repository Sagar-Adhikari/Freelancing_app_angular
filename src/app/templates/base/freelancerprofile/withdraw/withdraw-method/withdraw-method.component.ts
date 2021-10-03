import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { ApiService } from '../../../../../services/api/api.service';
import { constant } from '../../../../../../data/constant';
import { Title, Meta, DOCUMENT } from '@angular/platform-browser';

@Component({
  selector: 'app-withdraw-method',
  templateUrl: './withdraw-method.component.html',
  styleUrls: ['./withdraw-method.component.css']
})
export class WithdrawMethodComponent implements OnInit {
  withdrawForm: FormGroup;
  responseData: any = [];
  // error message
  errorMsg = '';
  errorMsgArr: any = [];
  withdraw_type = '';
  withdraw_amt: any;
  withdraw_fee: any;
  settlement_amount: any;
  available: any;

  constructor(
  	formBulider: FormBuilder,
	private apiService: ApiService,
	public dialogRef: MatDialogRef<WithdrawMethodComponent>,
	@Inject(MAT_DIALOG_DATA) public getdata: any,
  @Inject(DOCUMENT) private document: HTMLDocument,
  ) { 
  	this.withdrawForm = formBulider.group({
      'amount': [this.getdata.amount, Validators.compose([Validators.required])],
      'type': [this.getdata.type, Validators.compose([Validators.required])],
      'service_fee': [this.getdata.service_fee],
      'message': [this.getdata.message]
    });
  }

  ngOnInit() {
  	this.available = this.getdata.freelancer_amount;
  }

  saveWithdraw(formData) {
    this.errorMsg = '';
    this.errorMsgArr = [];
    if (this.withdrawForm.valid) {
    	var freeamt = parseFloat(this.getdata.freelancer_amount);
    	var amt = parseFloat(formData.amount);
    	if (freeamt >= amt){
    		const params = {
	          'user': this.getdata.user_id,
	          'amount': formData.amount,
	          'type': formData.type,
	          'service_fee': this.withdraw_fee,
	          'message': formData.message
	        };
	        this.apiService.postRequest(constant.apiurl + constant.getWithdrawRequest, params ).subscribe(
	          data => {
	            this.responseData = data;
	            if (this.responseData.body !== '') {
	              this.dialogRef.close({'status': 'success'});
	            }
	          }, err => {
	            console.log(err);
	        });
    	}else{
    		this.errorMsg = 'error';
    		this.errorMsgArr['amount'] = 'You have not sufficient balance';
    	}
    } else {
      this.errorMsg = 'error';
    }
  }

  onKeyUpamount(event){
  	this.withdraw_fee = '';
    this.settlement_amount = '';
  	this.withdraw_amt = parseFloat(event.srcElement.value);
  	if(this.withdraw_type == 'paypal'){
  		var service = this.withdraw_amt * ( parseFloat(this.getdata.paypal_fee) / 100 );
  		service = Math.round(service * 100) / 100
  		this.withdraw_fee = service;
  		this.settlement_amount = this.withdraw_amt - service;
  	}else if(this.withdraw_type == 'bank'){
  		var service = this.withdraw_amt * ( parseFloat(this.getdata.bank_fee) / 100 );
  		service = Math.round(service * 100) / 100
  		this.withdraw_fee = service;
  		this.settlement_amount = this.withdraw_amt - service;
  	}
  }

  onChangeType(value){
  	this.withdraw_fee = '';
    this.settlement_amount = '';
  	this.withdraw_type = value;
  	if(this.withdraw_amt > 0){
  		if(this.withdraw_type == 'paypal'){
	  		var service = this.withdraw_amt * ( parseFloat(this.getdata.paypal_fee) / 100 );
	  		service = Math.round(service * 100) / 100
	  		this.withdraw_fee = service;
	  		this.settlement_amount = this.withdraw_amt - service;
	  	}else if(this.withdraw_type == 'bank'){
	  		var service = this.withdraw_amt * ( parseFloat(this.getdata.bank_fee) / 100 );
	  		service = Math.round(service * 100) / 100
	  		this.withdraw_fee = service;
	  		this.settlement_amount = this.withdraw_amt - service;
	  	}
  	}
  }

  geterrorwithdrawMsg(field) {
    return this.withdrawForm.controls[field].hasError('required') ? 'Field is required' : '';
  }

  onclickcancel() {
    this.dialogRef.close('cancel');
  }
}
