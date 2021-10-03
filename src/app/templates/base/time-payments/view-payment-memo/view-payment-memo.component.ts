import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { ApiService } from '../../../../services/api/api.service';
import { constant } from '../../../../../data/constant';

@Component({
  selector: 'app-view-payment-memo',
  templateUrl: './view-payment-memo.component.html',
  styleUrls: ['./view-payment-memo.component.css']
})
export class ViewPaymentMemoComponent implements OnInit {

  constructor(
    public apiService: ApiService,
    public dialogRef: MatDialogRef<ViewPaymentMemoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
  }

  onCancelClick(): void {
    this.dialogRef.close('cancel');
  }

}
