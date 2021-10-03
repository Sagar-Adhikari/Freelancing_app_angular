import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatAutocomplete } from '@angular/material';

@Component({
  selector: 'app-shortcut',
  templateUrl: './shortcut.component.html',
  styleUrls: ['./shortcut.component.css']
})
export class ShortcutComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ShortcutComponent>) { }

  ngOnInit() {
  }


  
  onCancel(){
    this.dialogRef.close('cancel');
  }

}
