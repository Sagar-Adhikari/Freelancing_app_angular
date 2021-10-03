import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material';

@Component({
  selector: 'app-snackbar-msg',
  templateUrl: './snackbar-msg.component.html',
  styleUrls: ['./snackbar-msg.component.css']
})
export class SnackbarMsgComponent implements OnInit {
  message: any;
  status: any;
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
    this.message = this.data.message;
    this.status = this.data.status;
  }

  ngOnInit() {
  }

}
