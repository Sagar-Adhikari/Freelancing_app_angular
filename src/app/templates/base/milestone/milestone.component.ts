import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, DefaultValueAccessor, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatDialog, MatDialogRef, MatTooltipModule, MatSort, MatTableDataSource } from '@angular/material';
import { MatSortModule } from '@angular/material/sort'; 
import { constant } from '../../../../data/constant';
import { ApiService } from '../../../services/api/api.service';
import { UserService } from '../../../services/sync/user.service';
import { DescriptionComponent } from './description/description.component';
import * as moment from 'moment';
import { DepositEscrowComponent } from './../contract/deposit-escrow/deposit-escrow.component';
import { PayconfirmComponent } from './payconfirm/payconfirm.component';

@Component({
  selector: 'app-milestone',
  templateUrl: './milestone.component.html',
  styleUrls: ['./milestone.component.css']
})
export class MilestoneComponent implements OnInit {
  offer_id: any;
  resultData: any;
  offerData: any;
  display: boolean = false;
  is_owner: boolean = false;
  expires: any;
  freelancer_id: any;
  displayedColumns: string[] = ['no', 'name', 'amount', 'due_date', 'payment_status', 'active_action'];
  dataSource =  new MatTableDataSource;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatSort) sortpayReq: MatSort;
  payRegDisplayedColumns: string[] = ['no', 'name', 'amount', 'description', 'due_date', 'payment_status', 'action'];
  // payReqListDatasourse: any[] = [];
  payReqListDatasourse = new MatTableDataSource;
  payReqListData: any;

  //user avatar
  user_avatar_url = constant.apiurl + constant.user_avatar;
  addmilestoneForm: FormGroup;
  isbuttondisable: boolean = false;
  ismessage: boolean = false;
  errormessage: string = "";
  errorMsgArr: any;
  errorMsg = '';
  addmilestone_display_status: boolean = false;
  loggedId: any = ''
  userType: any = ''
  responseData: any;
  mileStoneActive: any = true;
  tempmileStoneActive: any = true;
  resActiveData: any;
  resMileStoneReqData: any;
  resPaymentReqList: any;
  resReqData: any;
  resDataMSWT: any;
  PopupDescripDialogRef: MatDialogRef<DescriptionComponent>;
  resCmsData: any;
  desc: any;
  constructor(private apiService: ApiService, private usersService: UserService, private router: Router, formbuilder: FormBuilder,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.offer_id = this.route.snapshot.paramMap.get('mid');
    this.loggedId = this.apiService.decodejwts().userid;
    this.userType = this.apiService.decodejwts().user_type;
    this.offerDetails();
    this.addmilestoneForm = formbuilder.group({
      'milestone_description': [null, Validators.compose([Validators.required])],
      'milestone_due_date': [null, Validators.compose([Validators.required])],
      'milestone_amount': [null, Validators.compose([Validators.required])]
    });
  }


  ngOnInit() {
    this.getPaymentRequestList();
    let url = constant.apiurl + constant.getcmspage + '?slug=agreement';
    this.apiService.getRequest(url).subscribe(data => {
      this.resCmsData = data;
      if (this.resCmsData.status === 200 && this.resCmsData.body.length !== 0) {
        this.desc = this.resCmsData.body[0].description;
      }
    });
  }

  //payment to freelancer milestone
  // delete Open job post
  paytofreelancer(event, freelancer_id) {
    const dialogRefimage = this.dialog.open(PayconfirmComponent, {
      disableClose: true,
      data: {}
    });
    dialogRefimage.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        let milestoneID = event.id;
        this.apiService.postRequest(constant.apiurl + constant.complete_contract_wtmilestone, {'contract_id': milestoneID, 'has_milestone' : 2}).subscribe(
          data => {
            this.resDataMSWT = data;
            if (this.resDataMSWT.status && this.resDataMSWT.status === 'success') {
              this.usersService.snackMessage('Payment completed to the milestone.');
              this.router.navigate([ this.router.url]); 
            }
          }, err => {
            console.log('Something went wrong.');
        });
      }
    });
  }

 
  //payment to freelancer milestone

  offerDetails() {
    this.apiService.getRequest(constant.apiurl + constant.savecontracts + this.offer_id + '/').subscribe(
      data => {
        this.display = true;
        this.resultData = data;
        this.offerData = this.resultData.body;
        this.dataSource = new MatTableDataSource(this.offerData.milestones);
        if (typeof this.offerData.detail != 'undefined') {
          if (this.userType == 'client') {
            this.router.navigate(['joblisting']);
          } else {
            this.router.navigate(['freelancerprofile']);
          }
        } else {
          var format = moment(this.offerData.created).format('YYYY/MM/DD');
          this.expires = moment(format, "YYYY/MM/DD").add('days', 7);
          console.log(this.offerData);
          this.freelancer_id = this.offerData.freelancer.id;
          if (this.loggedId == this.offerData.client.id) {
            this.is_owner = true;
          }
        }
      }, err => {
        console.log('Something went wrong.');
      });
  }

  addMilestone() {
    this.addmilestone_display_status = true;
  }
  cancelMilestone() {
    this.addmilestone_display_status = false;
  }
  saveMilestone(formData: any) {
    this.errorMsg = '';
    this.errorMsgArr = [];
    if (this.addmilestoneForm.valid) {
      let dformat = moment(formData.milestone_due_date).format("YYYY-MM-DD");
      let iMilestone = {
        'name': formData.milestone_description,
        'due_date': dformat,
        'deposit_amount': formData.milestone_amount,
        'payment_status': false
      };
      this.dataSource.data.push(iMilestone);  //add the new model object to the dataSource
      this.dataSource.data = [...this.dataSource.data];  //refresh the dataSource
      let iParams = {
        "contract": this.offer_id,
        "name": formData.milestone_description,
        "deposit_amount": formData.milestone_amount,
        "due_date": dformat
      };
      this.apiService.postRequest(constant.apiurl + constant.milestone, iParams).subscribe(
        data => {
          this.responseData = data;
          this.showSuccess();
          this.addmilestoneForm.reset();
          this.addmilestone_display_status = false;
        }, error => {
          console.log(error);
          this.errormessage = error.error.non_field_errors["0"];
          this.showError();
        });
    } else {
      this.addmilestone_display_status = true;
      this.errorMsg = 'error';
    }
  }
  showSuccess() {
    this.usersService.snackMessage('Milestone Added!!!');
    this.router.navigate([ this.router.url]); 
  }
  showError() {
    this.isbuttondisable = true;
    this.ismessage = true;
    setTimeout(() => {
      this.ismessage = false;
      this.isbuttondisable = false;
    }, 2000);
  }
  geterrorMsg(field) {
    return this.addmilestoneForm.controls[field].hasError('required') ? 'Field is required' : '';
  }
  endContractCall() {

  }

  getPaymentRequestList() {
    this.apiService.getRequest(constant.apiurl + constant.contract_payment_reqlist + '?contract=' + this.offer_id).subscribe(
      data => {
        this.resPaymentReqList = data;
        if (this.resPaymentReqList.status === 200) {
          this.payReqListDatasourse = new MatTableDataSource(this.resPaymentReqList.body);
        }
      });
  }

  onActivateMilestane(milestoneID, milestoneData) {
    const dialogChooseescrow = this.dialog.open(DepositEscrowComponent, {
      disableClose: true,
      data: { 'type': 'contract_create', 'contract_id': this.offerData.id, 'freelancer_id': this.offerData.freelancer.id, 'freelancer_name': this.offerData.freelancer.username, 'amount': milestoneData.deposit_amount }
    });
    dialogChooseescrow.afterClosed().subscribe(result => {
      if (result !== 'cancel' && result !== '') {
        this.apiService.putRequest(constant.apiurl + constant.contract_milestane_activate, { 'status': true, 'id': milestoneID }).subscribe(
          resdata => {
            this.resActiveData = resdata;
            this.usersService.snackMessage('Milestone activated successfully');
            this.router.navigate([ this.router.url]); 
          }, error => {
            console.log(error);
          });
      }
    });
  }

  onMilestaneRequest(milestoneID) {
    this.PopupDescripDialogRef = this.dialog.open(DescriptionComponent, {
      data: { 'popup': '', 'milestone_id': milestoneID.id ,'name':milestoneID.name,'deposit_amount':milestoneID.deposit_amount,'created':milestoneID.due_date,'payment_status':milestoneID.payment_status}
    });
    
    this.PopupDescripDialogRef.afterClosed().subscribe(result => {
      if (typeof result === 'object') {
        this.resMileStoneReqData = result;
        this.getPaymentRequestList();
        this.usersService.snackMessage('Request successfully sent');
        this.router.navigate([ this.router.url]); 
        this.offerData();
      }
    });
  }

  callOnTimeMileStone(check1, check2) {
    console.log(this.mileStoneActive);
    if (this.tempmileStoneActive && this.mileStoneActive && !check1 && !check2) {
      this.tempmileStoneActive = false;
      return true;
    } else {
      return false;
    }
  }

  viewPayRequest(payId) {
    this.PopupDescripDialogRef = this.dialog.open(DescriptionComponent, {
      data: { 'popup': 'view', 'payview' : this.payReqListDatasourse['data'].find(x => x['id'] === payId) }
    });
  }
}