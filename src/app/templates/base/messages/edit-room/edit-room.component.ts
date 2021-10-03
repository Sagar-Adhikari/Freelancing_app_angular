import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup ,Validators, FormControl, DefaultValueAccessor } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from '../../../../services/api/api.service';
import { constant } from '../../../../../data/constant';
import { Title, Meta, DOCUMENT } from '@angular/platform-browser';
import { environment } from '../.././../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { filter, map } from 'rxjs/operators';
import { MatSnackBar, MatTableDataSource, MatPaginator, MatSort, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatIcon, PageEvent } from '@angular/material';

@Component({
	selector: 'app-edit-room',
	templateUrl: './edit-room.component.html',
	styleUrls: ['./edit-room.component.css']
})
export class EditRoomComponent implements OnInit {

	editRoom:FormGroup;
	isbuttondisable:boolean = false;
	ismessage:boolean = false;
	is_success:boolean = false;
	errormessage:string = "";
	results:any;
	user_result: any;
	user_emails=[];
	constructor(public sanitizer:DomSanitizer, formbuilder:FormBuilder, private api : ApiService, private router:Router, @Inject(DOCUMENT) private document: HTMLDocument,
		private titleService: Title, 
		private route:ActivatedRoute, @Inject(MAT_DIALOG_DATA) public data: any, private dialogRef:MatDialogRef<EditRoomComponent>) {
		this.editRoom = formbuilder.group({
			'room_name' : [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
			'room_people' : [null, Validators.compose([Validators.required])]		});
	}

	public noWhitespaceValidator(control: FormControl) {
		let isWhitespace = (control.value || '').trim().length === 0;
		let isValid = !isWhitespace;
		return isValid ? null : { 'whitespace': true }
	}

	ngOnInit() {
		this.userlists();
		this.getEditinfos();
	}
	onCancel(): void {
    this.dialogRef.close();
  }
	getEditinfos(){
		const id = this.data.id;
		var url = constant.apiurl + constant.roomlisting+id;   
		this.api.getRequest(url).subscribe(result => {
			this.results = result;
		},error => {
			this.errormessage = error.error.non_field_errors["0"];
			this.showError();
		},() => {
	 		this.editRoom.patchValue({
		        'room_name': this.results.body.room_name,
		        'room_people':this.results.body.invite_users.split(',')
		    });

		});
	}

	userlists() {

	    const userlists = constant.apiurl + constant.roomproposal + '?user=' + this.api.decodejwts().userid + '&type=' + this.api.decodejwts().user_type;
	    this.api.getRequest(userlists).subscribe(
	      row => {
	        this.user_result = row;
	        this.user_emails = this.user_result.body;
	      },
	      err => {
	        console.log(err);
	      });
	  }

    editRoomSubmit(formData) {
    	if(this.editRoom.valid) {
    		const id = this.data.id; 
    		var href = constant.apiurl+constant.roomlisting+id+'/';   
    		var params = {
	    		room_name:formData.room_name.trim(),
	    		invite_users:formData.room_people.toString(),
	    		user: this.api.decodejwts().userid,
	    		room_type: 'Chat'
	    	};
    		this.api.putRequest(href,params).subscribe(result => {
    		},error => {
    			this.errormessage = error.error.non_field_errors["0"];
    			this.showError();
    		},() => {
    			this.showSuccess();   
    		});
    	} else {
    		this.getFormMessage();
    		this.showError();
    	}
    }

    getFormMessage () {
    	if(this.editRoom.controls['room_name'].hasError('whitespace') || this.editRoom.controls['room_name'].hasError('required') 
    		|| this.editRoom.controls['room_people'].hasError('whitespace') || this.editRoom.controls['room_people'].hasError('required')
    		) {
    		this.errormessage =  'Fields are required';
    }
}

showSuccess() {
	this.is_success = true;
	setTimeout(() => {
		this.router.navigated = false;
		this.router.navigate(['/messages']);
		this.is_success = false;
		this.dialogRef.close();
	}, 1000);
}

showError() {
	this.isbuttondisable = true;
	this.ismessage = true;          
	setTimeout(() => {
		this.ismessage = false;
		this.isbuttondisable = false;
	}, 2000);       
}

}
