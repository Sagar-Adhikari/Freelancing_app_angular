import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../../../services/api/api.service';
import { UserService } from '../../../services/sync/user.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { constant } from '../../../../data/constant';
import { FormBuilder, FormGroup ,Validators, FormControl, DefaultValueAccessor, FormArray } from '@angular/forms';
import * as moment from 'moment';
import { ContractCategoryComponent } from '../contract/contract-category/contract-category.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
	selector: 'app-invite-freelencer',
	templateUrl: './invite-freelencer.component.html',
	styleUrls: ['./invite-freelencer.component.css']
})
export class InviteFreelencerComponent implements OnInit {

	freelancer_id:any;
	freelancer_name:any;
	profileDetails:any;
	job_data:any;
	job_result = [];
	resfindPropose: any = [];
	logged_user:any;
	inviteForm: FormGroup;
	errorMsg:boolean = false;
	errormessage:any;
	constructor(@Inject(MAT_DIALOG_DATA) public getdata: any, private apiService: ApiService, private router:Router, 
		private route:ActivatedRoute, private fb: FormBuilder, public dialog: MatDialog, private DomSan: DomSanitizer, public dialogRef: MatDialogRef<InviteFreelencerComponent>, private user: UserService) { 
		this.freelancer_id = this.getdata.freelancer_id;
		this.freelancer_name = this.getdata.freelancer_name;
		this.logged_user = this.apiService.decodejwts().first_name+' '+this.apiService.decodejwts().last_name;

		this.inviteForm = fb.group({
			'job_reson': [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],     
			'job_id': [null, Validators.compose([Validators.required])],
		});

		this.inviteForm.patchValue({
			"job_reson" : "i'd like to invite you to apply to my job. Please review this job post and apply if you're available. "+this.logged_user
		});
	}

	noWhitespaceValidator(control: FormControl) {
		let isWhitespace = (control.value || '').trim().length === 0;
		let isValid = !isWhitespace;
		return isValid ? null : { 'whitespace': true }
	}

	ngOnInit() {
		this.getJoblist();

	}

	getJoblist(){
		var href = constant.apiurl+constant.joblisting;
		var params = 'user='+this.apiService.decodejwts().userid;
		this.apiService.getRequest(href+'?'+params).subscribe(
			data => {
				this.job_data = data;
				this.job_data.body.forEach(item => { this.job_result.push(item) } );
			});
	}

	saveInvite(formData){
		this.errorMsg = false;
		if (this.inviteForm.valid) {
			// check user already proposed this job
          const check_url = constant.apiurl + constant.job_proposal + '?job=' + formData.job_id + '&user=' + this.getdata.freelancer_id;
          this.apiService.getRequest(check_url).subscribe(
            row => {
              this.resfindPropose = row;
              console.log(this.resfindPropose);

              if (this.resfindPropose.body.count > 0 && (this.resfindPropose.body.results[0].offer_status != '' || this.resfindPropose.body.results[0].status != '') && this.resfindPropose.body.results[0].offer_status != 'Modified_by_client') {
                alert('Already Proposed for this job');
                this.errorMsg = true;
              }else{
              	var href = constant.apiurl+constant.invitefree;
				var datas= {
	              status: 'Request',
	              reason:formData.job_reson.trim(),
	              user:this.apiService.decodejwts().userid,
	              job:formData.job_id,
	              freelancer:this.getdata.freelancer_id
	            };
				this.apiService.postRequest(href,datas).subscribe(result => {
				},error => {
					console.log('something went wrong.');
				},() => {
					this.dialogRef.close('close');
					this.user.snackMessage('Invitation has been send successfully.');
				});
              }
            });

			
		}else{
			this.errorMsg = true;
		}
	}

	onCancel(){
		this.dialogRef.close('cancel');
	}

	geterrorMsg(field) {
		if(field!='job_id'){
			return (this.inviteForm.controls[field].hasError('required') || this.inviteForm.controls[field].hasError('whitespace')) ? 'Field is required' : '';
		}else{
			return this.inviteForm.controls[field].hasError('required') ? 'Field is required' : '';
		}
	}

}
