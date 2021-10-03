import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ApiService } from '../../../services/api/api.service';
import { UserService } from '../../../services/sync/user.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { constant } from '../../../../data/constant';


import * as moment from 'moment';
import { MatDialog, MatDialogRef, MatTableDataSource, PageEvent, MatPaginator } from '@angular/material';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { UpdateOfferComponent } from '../view-offer/update-offer/update-offer.component';
import { DescriptionComponent } from './../milestone/description/description.component';
import { DisputeComponent } from '../view-offer/dispute/dispute.component';
import { PayconfirmComponent } from '../milestone/payconfirm/payconfirm.component';

@Component({
  selector: 'app-view-offer',
  templateUrl: './view-offer.component.html',
  styleUrls: ['./view-offer.component.css']
})

export class ViewOfferComponent implements OnInit {
  
  offer_id:any;
  job_id:any;
  resultData:any;
	offerData:any;
	disputelist: any;
  disputeData: any;
	display:boolean = false;
  contracts_type = [
  {'key':'1', 'name' : 'No limit'},
	{'key':'2', 'name' : '5 hrs/week'},
	{'key':'3', 'name' : '10 hrs/week'},
	{'key':'4', 'name' : '15 hrs/week'},
	{'key':'5', 'name' : '20 hrs/week'},
	{'key':'6', 'name' : '25 hrs/week'},
	{'key':'7', 'name' : '30 hrs/week'},
	{'key':'8', 'name' : '35 hrs/week'},
	{'key':'9', 'name' : '40 hrs/week'},
	{'key':'10', 'name' : 'Other...'},
  ];
  //user avatar
  user_avatar_url = constant.apiurl + constant.user_avatar;
  is_owner:boolean = false;
  expires:any;
  freelancer_id:any;
	resDataMSWT: any;
	PopupDescripDialogRef: MatDialogRef<DescriptionComponent>;
	resReqData: any;
	client_id: any;
  userType: any;
  displayDispute: any;
  displayReply: any;
  displayedColumns: string[] = ['name', 'amount', 'due_date'];
	displayedMsgColumns: string[] = ['user_name', 'chat_message', 'time'];
	disputeCount:number;
	milestoneCount:number;
	Paginatorhidder:boolean;
	messageData:any = new MatTableDataSource<any>(this.disputelist);
	disputePageEvent: PageEvent;
  constructor(
		private apiService: ApiService,
		private router: Router,
		private usersService: UserService,
		private route: ActivatedRoute,
		public dialog: MatDialog,
		private DomSan: DomSanitizer
	) {
  	this.offer_id = this.route.snapshot.paramMap.get('id');
  	this.displayDispute = false;
  	this.displayReply = false;
    this.offerDetails();
    this.disputeStatus();
    this.listMessage();
  }

	@ViewChild( 'DisputesPaginator' ) DisputesPaginator : MatPaginator;
	@ViewChild( 'milestonePaginator' ) milestonePaginator : MatPaginator;

  ngOnInit() {
  }

   offerDetails(){
	  	this.apiService.getRequest(constant.apiurl + constant.savecontracts + this.offer_id+'/').subscribe(
	      data => {
	      	this.display = true;
					this.resultData = data;
					this.milestoneCount = data['count'];
					this.offerData = this.resultData.body;
					console.log(this.offerData);
					this.job_id = this.offerData.job;
	        if (typeof this.offerData.detail != 'undefined') {
	        	if(this.apiService.decodejwts().user_type=='client'){
	        		this.router.navigate(['joblisting']);	
	        	}else{
	        		this.router.navigate(['freelancerprofile']);	
	        	}	        	
	        }else{
	        	var format = moment(this.offerData.created).format("YYYY-MM-DD");
		        this.expires = moment(format, "YYYY/MM/DD").add('days', 7);
		        this.freelancer_id = this.offerData.freelancer.id;
		        this.client_id = this.offerData.client.id;
		        if(this.apiService.decodejwts().userid==this.offerData.client.id){
		        	this.is_owner = true;
		        	this.userType = 2;
		        }else{
		        	this.userType = 1;
		        }
	        }
	      }, err => {
	      	console.log('Something went wrong.');
	    });	
	}

	listMessage(page = 1) {
		this.apiService.getRequest(constant.apiurl + constant.getDisputeMessageAll + '?contract_id=' + this.offer_id + '&page=' + page).subscribe(
	      data => {
					this.resultData = data;
					this.disputelist = this.resultData.body.results;
					this.disputeCount = this.resultData.body.count;
					this.messageData = this.disputelist;
					if (this.disputeCount > 10) {
						this.Paginatorhidder = true;
					} else {
						this.Paginatorhidder = false;
					}
	      }, err => {
	      	console.log('Something went wrong.');
	    });	
	}

	onPageChange(pageEvent) {
		this.disputePageEvent = pageEvent;
    this.listMessage(pageEvent.pageIndex + 1);
	}

	disputeStatus(){
		this.apiService.getRequest(constant.apiurl + constant.disputeStatus + '?contract_id='+this.offer_id).subscribe(
	      data => {
	      	this.resultData = data;
			this.disputeData = this.resultData.body;
	        this.displayDispute = this.disputeData.button_status;
	        this.displayReply = this.disputeData.has_current_dispute;
	      }, err => {
	      	console.log('Something went wrong.');
	    });	
	}

	updateOffer(type:number){
		const dialogChoosebilling = this.dialog.open(UpdateOfferComponent, {
	      disableClose: true,
	      data: {'type': type, 'contract_id':this.offer_id, 'freelancer_id': this.freelancer_id, 'job_id': this.job_id}
	    });

	    dialogChoosebilling.afterClosed().subscribe(result => {
	    });
	}


	onFixedWTPayment() {
    const dialogRefimage = this.dialog.open(PayconfirmComponent, {
      disableClose: true,
      data: {}
    });
    dialogRefimage.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.apiService.postRequest(constant.apiurl + constant.complete_contract_wtmilestone, {'contract_id': this.offer_id}).subscribe(
			data => {
				this.resDataMSWT = data;
				if (this.resDataMSWT.status && this.resDataMSWT.status === 'success') {
					this.router.navigate(['/freelancer-feedback/'+this.freelancer_id+'/'+this.offer_id+'/completed']);
					//this.offerDetails();
					//this.usersService.snackMessage('Payment completed and job closed successfully.');
				}
			}, err => {
				console.log('Something went wrong.');
		});
      }
    });
  }

	onPaymentRequest() {
    this.PopupDescripDialogRef = this.dialog.open(DescriptionComponent, {
      data: { 'popup': '', 'contract_id': this.offer_id, 'from': 'proposalRequest'}
    });
    this.PopupDescripDialogRef.afterClosed().subscribe(result => {
      if (typeof result === 'object') {
				this.resReqData = result;
				this.offerDetails();
        this.usersService.snackMessage('Request successfully sent');
      }
    });
	}
	
	// dispute(type:number, action:string){
	// 	const dialogChoosebilling = this.dialog.open(DisputeComponent, {
	//       disableClose: true,
	//       data: {'type': type, 'action': action, 'contract_id':this.offer_id, 'freelancer_id': this.freelancer_id, 'client_id': this.client_id}
	//     });

	//     dialogChoosebilling.afterClosed().subscribe(result => {
	//        if(result.status == 'success'){
	//        	this.router.navigate(['view-offer/'+this.offer_id]);	
	//        }
	//     });
	// }

}
