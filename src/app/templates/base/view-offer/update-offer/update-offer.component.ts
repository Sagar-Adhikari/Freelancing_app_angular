import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../../../../services/api/api.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatAutocomplete } from '@angular/material';
import { constant } from '../../../../../data/constant';
import { UserService } from '../../../../services/sync/user.service';

@Component({
  selector: 'app-update-offer',
  templateUrl: './update-offer.component.html',
  styleUrls: ['./update-offer.component.css']
})
export class UpdateOfferComponent implements OnInit {
  
  type:number;
  contract_id:any;
  job_id:any;
  isbuttondisable:boolean = false;
  freelancer_id:any;
  result:any;
  isloader:boolean;
  constructor(private apiService: ApiService, @Inject(MAT_DIALOG_DATA) public getdata: any, public dialogRef: MatDialogRef<UpdateOfferComponent>, private router:Router, private syncVar: UserService) { }

  ngOnInit() {
  	this.type = this.getdata.type;
  	this.contract_id = this.getdata.contract_id;
    this.job_id = this.getdata.job_id;
  	this.freelancer_id = this.getdata.freelancer_id;
  }

  goTocontract(type:number){
  	var msg = 'Withdraw_by_client';
  	if(type==2){
  		msg = 'Modified_by_client';
  	}else if(type==3){
  		msg = 'Accept';
  	}else if(type==4){
  		msg = 'Reject';
  	}

  	var datas ={
  		"offer_status": msg,
        "id": this.contract_id
  	};
  	this.apiService.putRequest(constant.apiurl + constant.update_contract_status, datas).subscribe(
        data => {
          this.result = data;
          if (this.result.status) {
            this.isloader = false;
            this.isbuttondisable = true;
            this.syncVar.snackMessage('Contract updated successfully.');
            setTimeout(() => {
              this.isbuttondisable = false;
            }, 2000);

          } else {
          	this.isloader = false;
          	this.syncVar.snackMessage('Contract updated successfully.');
          	this.dialogRef.close('close');
            if(type==2){
              this.router.navigate(['contract/'+this.freelancer_id+'/'+this.job_id]);
            }else{
              this.router.navigate(['view-offer/'+this.contract_id]);
            }
            
          }
    });
  }

  goCanel(){
  	this.dialogRef.close('cancel');
  	this.router.navigate(['view-offer/'+this.contract_id]);
  }

}
