/*
 * Page : Deposit Escrow
 * Use: This page only used to alert the escrow deposit information
 * Functionality :
 *  >> Display the fixed deposit amount with static content
 *  >> Based on user action redirect to deposit page
 * Created Date : 10/01/2019
 * Updated Date : 10/01/2019
 * Copyright : Bsetec
 */
import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../../../../services/api/api.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatAutocomplete } from '@angular/material';
import { constant } from '../../../../../data/constant';

@Component({
  selector: 'app-deposit-escrow',
  templateUrl: './deposit-escrow.component.html',
  styleUrls: ['./deposit-escrow.component.css']
})
export class DepositEscrowComponent implements OnInit {
  //getting this data from parent window
  amount: any;
  respData: any;
  contract: any;
  isbuttondisable: boolean = false;
  type: any;
  constructor(private snackBar : MatSnackBar, private apiService: ApiService, @Inject(MAT_DIALOG_DATA) public getdata: any, public dialogRefescrow: MatDialogRef<DepositEscrowComponent>) {
    this.amount = this.getdata.amount;
    this.type = (typeof (this.getdata.type) != 'undefined') ? this.getdata.type : '';
    this.contract = (typeof (this.getdata.contract_id) != 'undefined') ? this.getdata.contract_id : '';
  }

  ngOnInit() {
  }

  /** This function is used to close the billing popup */
  onCancel() {
    this.dialogRefescrow.close('cancel');
  }
  depositEscrow() {
    if (this.type == 'contract_create') {
      this.isbuttondisable = true;
      if(this.amount < 1){
        this.snackBar.open('Please enter a Amount greater 0')
        setTimeout(() => {
					this.snackBar.dismiss();
        }, 1500);
        this.isbuttondisable = false;
        return false;
      }
      this.apiService.putRequest(constant.apiurl + constant.save_escrow, { 'amount': this.amount, 'contract_id': this.contract }).subscribe(
        data => {
          this.respData = data;
          if ((typeof (this.respData.transaction_id) != 'undefined') && this.respData.transaction_id != "") {
            this.dialogRefescrow.close({ 'status': 'success', 'transaction_id': this.respData.transaction_id });
          }
        });
    } else {
      this.dialogRefescrow.close('close');
    }
  }
}
