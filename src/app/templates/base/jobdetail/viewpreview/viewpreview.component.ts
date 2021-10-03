import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-viewpreview',
  templateUrl: './viewpreview.component.html',
  styleUrls: ['./viewpreview.component.css']
})
export class ViewpreviewComponent implements OnInit {
  urlFile: any;
  constructor(
    public dialogRef: MatDialogRef<ViewpreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public getdata: any,
    private sanitizer: DomSanitizer
  ) {
    console.log(this.getdata.file);
    this.urlFile = this.sanitizer.bypassSecurityTrustResourceUrl(this.getdata.file);
    console.log(this.getdata.ext);
  }

  ngOnInit() {
  }

  onclickcancel() {
    this.dialogRef.close('cancel');
  }

}
