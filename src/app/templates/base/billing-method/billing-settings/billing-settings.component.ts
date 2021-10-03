import { PaySystemComponent } from './../pay-system/pay-system.component';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api/api.service';
import { UserService } from '../../../../services/sync/user.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';

// import { BillingMethodComponent } from '../../billing-method/billing-method.component';

@Component({
  selector: 'app-billing-settings',
  templateUrl: './billing-settings.component.html',
  styleUrls: ['./billing-settings.component.css']
})
export class BillingSettingsComponent implements OnInit {
  loggedUserId: any;
  PopupDialogRef2: MatDialogRef<PaySystemComponent>;

  constructor(
    private userService: UserService,
    private apiService: ApiService,
    private dialogBiling: MatDialog,
    private router: Router
  ) { }

  ngOnInit() {
    this.userService.sendHeaderLayout('layout2');
    this.loggedUserId = this.apiService.decodejwts().userid;
  }
  billingPopup() {
    this.PopupDialogRef2 = this.dialogBiling.open(PaySystemComponent,{
      disableClose: true,
      data: { 'type': 1 }
    });

    this.PopupDialogRef2.afterClosed().subscribe(result => {
      if(result != 'cancel' && result != 'goback'){
        this.userService.snackMessage('Billing information has been added successfully.');
        this.router.navigate(['setting/billing-methods']);
      }
    });
  }


}
