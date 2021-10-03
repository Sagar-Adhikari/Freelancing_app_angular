import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-deleteconfirm',
  templateUrl: './deleteconfirm.component.html',
  styleUrls: ['./deleteconfirm.component.css']
})
export class DeleteconfirmComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DeleteconfirmComponent>,
  ) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close('close');
  }
  confirmDelete(): void {
    this.dialogRef.close('confirm');
  }
}
