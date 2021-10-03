import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-payconfirm',
  templateUrl: './payconfirm.component.html',
  styleUrls: ['./payconfirm.component.css']
})
export class PayconfirmComponent implements OnInit {

  constructor(
	  @Inject(MAT_DIALOG_DATA) public data: any,
	  public dialogRef: MatDialogRef<PayconfirmComponent>,
  ) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close('close');
  }
  confirm(): void {
    this.dialogRef.close('confirm');
  }

}
