import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { constant } from '../../../../../data/constant';
import { ApiService } from '../../../../services/api/api.service';

@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.component.html',
  styleUrls: ['./add-payment.component.css']
})
export class AddPaymentComponent implements OnInit {
  withdraw_option = localStorage.getItem('wp_withdraw_option');
  withdraw_fee_bank = localStorage.getItem('wp_withdraw_fee_bank');
  withdraw_fee_paypal = localStorage.getItem('wp_withdraw_fee_paypal');
  constructor(
    @Inject(MAT_DIALOG_DATA) private getdata: any,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<AddPaymentComponent>,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    console.log(this.getdata);
  }
  /** This function is used to close the popup */
  onCancel() {
    this.dialogRef.close('cancel');
  }
  setupBank() {
    this.dialogRef.close('cancel');
  }
  setupPaypal() {
    this.dialogRef.close('cancel');
  }

}
