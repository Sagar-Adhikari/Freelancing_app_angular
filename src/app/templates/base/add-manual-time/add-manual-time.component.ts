/*
 * Page : Add Manual Time Popup
 * Use: This popup only used to add the manual time for contracts
 * Functionality :
 *  >> Display the material form
 *  >> Saved the manual time to backend
 * Created Date : 10/01/2019
 * Updated Date : 10/01/2019
 * Copyright : Bsetec
 */
import { Component, OnInit, Inject, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ApiService } from '../../../services/api/api.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatAutocomplete, MatTableDataSource } from '@angular/material';
import { constant } from '../../../../data/constant';
import { FormBuilder, FormGroup, Validators, FormControl, DefaultValueAccessor, FormArray } from '@angular/forms';
import { of } from 'rxjs';
import { PayPalConfig, PayPalEnvironment, PayPalIntegrationType } from 'ngx-paypal';
import { UserService } from '../../../services/sync/user.service';
import * as moment from 'moment';
import { map } from 'rxjs-compat/operator/map';

@Component({
	selector: 'app-add-manual-time',
	templateUrl: './add-manual-time.component.html',
	styleUrls: ['./add-manual-time.component.css']
})
export class AddManualTimeComponent implements OnInit {

	//getting this data from parent window
	contract_id: any;
	jobstartdate:any;
	//default time
	from_time: any = moment().format("YYYY-MM-DD HH:mm:ss");
	to_time: any = moment().format("YYYY-MM-DD HH:mm:ss");
	listvalidate: boolean = false;
	manualtimeForm: FormGroup;
	isbuttondisable: boolean = false;
	errorMsg: boolean = false;

	checkError: boolean = false;
	checkErrorsave: boolean = false;
	GettingTime: any[] = [];
	GetHoursChecked: any;
	TotalHoursSelected: any = 0;
	errorMsgStr:string;

	constructor(private apiService: ApiService, @Inject(MAT_DIALOG_DATA) public getdata: any, public dialogRefmanualtime: MatDialogRef<AddManualTimeComponent>, private router: Router, private route: ActivatedRoute, private fb: FormBuilder, private syncVar: UserService) {

		this.contract_id = this.getdata.contract_id;
		this.jobstartdate = this.getdata.start_date;
		this.manualtimeForm = fb.group({
			'manual_date': [null, Validators.compose([Validators.required])],
			'Time_List': this.fb.array([
				this.formsubgroup()
			]),
			'manual_memo': [null, Validators.compose([Validators.required, this.noWhitespaceValidator])]
		});

		/** This function is used to validate from time and to time start*/
		this.manualtimeForm.valueChanges.subscribe(() => {
			let enteredArr = this.manualtimeForm.controls['Time_List'].value;
			this.TotalHoursSelected = 0;
			let getHr: any = 0;
			this.GettingTime.length = 0;
			let i = 0;
			if (this.manualtimeForm.valid) {
				enteredArr.map(get => {
					//check with current from time and to time
					if (get.manual_from_time.getTime() !== get.manual_to_time.getTime() && get.manual_from_time.getTime() < get.manual_to_time.getTime()) {
						// console.log('current time from and two are not same and from time is smaller than to time');
						this.GettingTime.push({ "manual_from_time": get.manual_from_time.getTime(), "manual_to_time": get.manual_from_time.getTime() });
					} else {
						this.syncVar.snackMessage('Not valid');
						this.errorMsgStr = "This time is Not a Valid -From : "+ moment(get.manual_from_time).format('LT') + ' To : '+ moment(get.manual_to_time).format('LT');
						this.checkError = true;
						// console.log('Not Valid 1')
						return false;
					}
					//check with current from time and to time

					
					// console.group('foreach')
					let ch = 0;
					enteredArr.forEach( ex => {
						
						let i = enteredArr.indexOf(get);
						// console.log('index : '+i)
					//check with other time entered
	
					// this.GettingTime.map(ex => {
						//from time not equal to ex-from or to-time and to-time not equal to ex-from or ex-to time start
						if ((get.manual_from_time.getTime() !== ex.manual_from_time || ex.manual_to_time) && (get.manual_to_time.getTime() !== ex.manual_from_time || ex.manual_to_time)) {
							// console.log('from time not equal to ex-from or two-time and to-time not equal to ex-from time or ex-to-time')
						} else {
							// console.log('Not valid 2')
							this.syncVar.snackMessage('Not valid');
							this.errorMsgStr = "This time already exists -From : "+ moment(ex.manual_from_time).format('LT') + ' To : '+ moment(ex.manual_to_time).format('LT');
							this.checkError = true;
							return false;
						}
						//from time not equal to ex-from or to-time and to-time not equal to ex-from or ex-to time start
						
						// //check with ex-time
						if (get.manual_from_time.getTime() > ex.manual_from_time && get.manual_from_time.getTime() < ex.manual_to_time && get.manual_to_time.getTime() < ex.manual_to_time && get.manual_from_time.getTime() < ex.manual_to_time) {
							// console.log('Not valid - from time greater than ex-from and to-time smaller than ex-to time')
							this.syncVar.snackMessage('Not valid');
							this.errorMsgStr = "Current time " +'From : '+moment(get.manual_from_time).format('LT') + ' To : '+ moment(get.manual_to_time).format('LT') + " has conflict with previous time -From : "+ moment(ex.manual_from_time).format('LT') + ' To : '+ moment(ex.manual_to_time).format('LT');
							this.checkError = true;
							return false;
						} else if (get.manual_from_time.getTime() < ex.manual_from_time && get.manual_to_time.getTime() > ex.manual_to_time) {
							// console.log('Not valid - from time smaller than ex-from-time and to-time is greater than ex-to-time')
							this.syncVar.snackMessage('Not valid');
							this.errorMsgStr = "Current time " +'From : '+moment(get.manual_from_time).format('LT') + ' To : '+ moment(get.manual_to_time).format('LT') + " has conflict with previous time -From : "+ moment(ex.manual_from_time).format('LT') + ' To : '+ moment(ex.manual_to_time).format('LT');
							this.checkError = true;
							return false;
						} else if (get.manual_from_time.getTime() < ex.manual_from_time && get.manual_to_time.getTime() > ex.manual_from_time && get.manual_to_time.getTime() < ex.manual_to_time) {
							// console.log('Not valid - from time smaller than ex-from-time and to-time smaller than ex-to-time')
							this.syncVar.snackMessage('Not valid');
							this.errorMsgStr = "Current time " +'From : '+moment(get.manual_from_time).format('LT') + ' To : '+ moment(get.manual_to_time).format('LT') + " has conflict with previous time -From : "+ moment(ex.manual_from_time).format('LT') + ' To : '+ moment(ex.manual_to_time).format('LT');
							this.checkError = true;
							return false;
						} else if (get.manual_from_time.getTime() > ex.manual_from_time && get.manual_to_time.getTime() > ex.manual_to_time && get.manual_from_time.getTime() < ex.manual_to_time) {
							// console.log('Not valid - from time greater than ex-from-time and to-time greater than ex-to-time')
							this.syncVar.snackMessage('Not valid');
							this.errorMsgStr = "Current time " +'From : '+moment(get.manual_from_time).format('LT') + ' To : '+ moment(get.manual_to_time).format('LT') + " has conflict with previous time -From : "+ moment(ex.manual_from_time).format('LT') + ' To : '+ moment(ex.manual_to_time).format('LT');
							this.checkError = true;
							return false;
						} else {
							// console.log('Allow');
							
							// console.groupEnd();
						}
						ch++;
					});
					// console.groupEnd();
					
						// //check with ex-time
						
						// 	//getting total hoursSelected
							this.GetHoursChecked = this.diff(get.manual_from_time, get.manual_to_time).split(':');
							// console.log(this.GetHoursChecked);
							if (this.GetHoursChecked[1] >= '23' && this.GetHoursChecked[2] > '58') {
								// console.log("You cannot Select More than this task");
								this.syncVar.snackMessage('You cannot Select More than this task');
								this.errorMsgStr = 'you cannot selecting more than 24 Hours of time';
								this.checkError = true;
								return false;
							} else {
								getHr += parseInt(this.GetHoursChecked[1]) + Math.round(Math.round(parseInt(this.GetHoursChecked[2])) / 60);
								this.TotalHoursSelected = getHr;
								console.log("Hours selected till now :" + this.TotalHoursSelected);
								if (this.TotalHoursSelected >= 24) {
									this.syncVar.snackMessage("you cannot selecting more than 24 Hours of time");
									this.errorMsgStr = 'you cannot selecting more than 24 Hours of time';
									// console.log("you cannot selecting more than 24 Hours of time");
									this.checkError = true;
									return false;
								} else {
									this.checkError = false;
								}
							}
					//check with other time entered
					if(ch == enteredArr.length){
						console.log('Success')
						this.checkError = false;
						this.errorMsgStr = '';
					}else{
						console.log('not Success')
						this.checkError = true;
					}
				});
			}
			
		});
		/** This function is used to validate from time and to time end */
	}
	diff(start, end) {
		let date1 = new Date(start);
		let date2 = new Date(end);
		let res = Math.abs(Number(date2) - Number(date1)) / 1000;
		var days = Math.floor(res / 86400);
		var hours = Math.floor(res / 3600) % 24;
		var minutes = Math.floor(res / 60) % 60;
		var seconds = res % 60;
		return days + ':' + hours + ':' + minutes + ':' + seconds;
	}


	/** This function is used to validate the whitespace in the from */
	noWhitespaceValidator(control: FormControl) {
		let isWhitespace = (control.value || '').trim().length === 0;
		let isValid = !isWhitespace;
		return isValid ? null : { 'whitespace': true }
	}
	formsubgroup(): FormGroup {
		return this.fb.group({
			'manual_from_time': ['', Validators.compose([Validators.required])],
			'manual_to_time': ['', Validators.compose([Validators.required])]
		});
	}
	formsubgroupappend(): void {
		(<FormArray>this.manualtimeForm.get('Time_List')).push(this.formsubgroup());
	}

	removedate(event) {
		(<FormArray>this.manualtimeForm.get('Time_List')).removeAt(event);
	}
	ngOnInit() {

	}

	/** This function is used to save the manual time to backend */

	saveTiming(formData) {
		this.errorMsg = false;
		if (this.manualtimeForm.valid) {
			var href = constant.apiurl + constant.contract_time;
			var m_date = moment(formData.manual_date).format("YYYY-MM-DD");
			var Time_List = formData.Time_List;
			console.log(Time_List)
			let from_timeArr: string[] = [];
			let to_timeArr: string[] = [];
			Time_List.map(T => {
				from_timeArr.push(moment(T.manual_from_time).format('LT'));
				to_timeArr.push(moment(T.manual_to_time).format('LT'));
			});
			var hs = moment.utc(moment(formData.manual_to_time, "2019-02-12T10:26:49.000").diff(moment(formData.manual_from_time, "2019-02-12T10:26:49.000"))).format("HH:mm")

			var datas = {
				contract: this.contract_id,
				manual_date: m_date,
				from_times: from_timeArr,
				to_times: to_timeArr,
				user: this.apiService.decodejwts().userid,
				memo: formData.manual_memo
			};
			//  return false;
			this.apiService.postRequest(href, datas).subscribe(result => {
			}, error => {
				console.log('something went wrong.');
			}, () => {
				this.dialogRefmanualtime.close('close');
				this.syncVar.snackMessage('Time has been added successfully.');
			});
		} else {
			this.errorMsg = true;
		}
	}

	/** This function is used to display the error message */
	geterrorMsg(field) {
		if (field == 'manual_memo') {
			return (this.manualtimeForm.controls[field].hasError('required') || this.manualtimeForm.controls[field].hasError('whitespace')) ? 'Field is required' : '';
		} else {
			return this.manualtimeForm.controls[field].hasError('required') ? 'Field is required' : '';
		}
	}

	/** This function is used to close the manual time popup */
	onCancel() {
		this.dialogRefmanualtime.close('cancel');
	}


}
