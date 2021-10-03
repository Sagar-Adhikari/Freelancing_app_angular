import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { ApiService } from '../../../../services/api/api.service';
import { constant } from '../../../../../data/constant';

@Component({
  selector: 'app-dispute',
  templateUrl: './dispute.component.html',
  styleUrls: ['./dispute.component.css']
})
export class DisputeComponent implements OnInit {
  disputeForm: FormGroup;
  responseData: any = [];
  // error message
  errorMsg = '';
  errorMsgArr: any = [];
  action: any;
  userType: any;
  @ViewChild('ratevalue') rate: any;
  constructor(
  	formBulider: FormBuilder,
	private apiService: ApiService,
	public dialogRef: MatDialogRef<DisputeComponent>,
	@Inject(MAT_DIALOG_DATA) public getdata: any,
  ) {
    if(this.getdata.action == 'create'){
    	this.disputeForm = formBulider.group({
	      'amount': [this.getdata.amount, Validators.compose([Validators.required])],
	      'subject': [this.getdata.subject, Validators.compose([Validators.required])],
	      'message': [this.getdata.message]
	    });
    }else if(this.getdata.action == 'reply'){
    	this.disputeForm = formBulider.group({
	      'message': [this.getdata.message, Validators.compose([Validators.required])]
	    });
    }else{
    	this.disputeForm = formBulider.group({
	      'message': [this.getdata.message]
	    });
    }
  	
   }

  ngOnInit() {
  	this.action = this.getdata.action;
  	this.userType = this.getdata.type;
  }

  saveDispute(formData) {
    this.errorMsg = '';
    this.errorMsgArr = [];
    if (this.disputeForm.valid) {
    	if(this.getdata.action == 'create'){
    		const params = {
		      'amount': formData.amount,
		      'contract': this.getdata.contract_id,
		      'reason_subject': formData.subject,
		      'detail_reason': formData.message
		    };
		    this.apiService.postRequest(constant.apiurl + constant.createDispute, params ).subscribe(
		      data => {
		        this.responseData = data;
		        if (this.responseData.body !== '') {
		          this.dialogRef.close({'status': 'success'});
		        }
		      }, err => {
		        console.log(err);
		    });
    	}else if(this.getdata.action == 'reply'){
    		const params = {
		      'contract_id': this.getdata.contract_id,
		      'chat_message': formData.message
		    };
		    this.apiService.postRequest(constant.apiurl + constant.getDisputeMessage, params ).subscribe(
		      data => {
		        this.responseData = data;
		        if (this.responseData.body !== '') {
		          this.dialogRef.close({'status': 'success'});
		        }
		      }, err => {
		        console.log(err);
		    });
    	}else{
    		const params = {
		      'contract_id': this.getdata.contract_id,
		      'close_message': formData.message,
		      'type': this.getdata.type
		    };
		    this.apiService.postRequest(constant.apiurl + constant.closeDispute, params ).subscribe(
		      data => {
		        this.responseData = data;
		        if (this.responseData.body !== '') {
		          this.dialogRef.close({'status': 'success'});
		        }
		      }, err => {
		        console.log(err);
		    });
    	}
		
    } else {
      this.errorMsg = 'error';
    }
  }
  onKeyUpamount(event) {
    var dataa = event.srcElement.value;
    this.rate.nativeElement.value = dataa.replace(/[^\d.]/ig, '');
  }

  geterrordisputeMsg(field) {
    return this.disputeForm.controls[field].hasError('required') ? 'Field is required' : '';
  }

  onclickcancel() {
    this.dialogRef.close('cancel');
  }


}
