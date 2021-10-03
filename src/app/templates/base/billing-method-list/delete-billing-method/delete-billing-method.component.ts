/*
 * Page : Delete Billing Method 
 * Use: This page only used to delete the billing methods
 * Functionality :
 *  >> Create the angular material dialog
 *  >> delete the billing method using api
 * Created Date : 05/01/2019
 * Updated Date : 07/01/2019
 * Copyright : Bsetec
 */
 import { Component, OnInit, Inject } from '@angular/core';
 import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

 import { ApiService } from '../../../../services/api/api.service';
 import { constant } from '../../../../../data/constant';
 import { UserService } from '../../../../services/sync/user.service';

 @Component({
 	selector: 'app-delete-billing-method',
 	templateUrl: './delete-billing-method.component.html',
 	styleUrls: ['./delete-billing-method.component.css']
 })
 export class DeleteBillingMethodComponent implements OnInit {

 	response:any;
 	constructor(
 		@Inject(MAT_DIALOG_DATA) public data: any,
 		public dialogRef: MatDialogRef<DeleteBillingMethodComponent>,
 		public api : ApiService,
 		public usersService : UserService
 		) { }

 	ngOnInit() {
 	}

 	onNoClick(): void {
 		this.dialogRef.close();
 	}

 	confirmDelete(): void {
 		const href = constant.apiurl+constant.delete_card;    
 		var datas = { billing_id: this.data.billing_id };
 		this.api.putRequest(href, datas).subscribe(
 			data => {
				 this.response = data;
				this.usersService.setBillingcount(this.response.billing);
				this.usersService.snackMessage("Record deleted successfully.");
				this.dialogRef.close();
 		});
 	}

 }
