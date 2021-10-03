import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../../../../services/api/api.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatAutocomplete } from '@angular/material';
import { constant } from '../../../../../data/constant';
import { FormBuilder, FormGroup ,Validators, FormControl, DefaultValueAccessor, FormArray } from '@angular/forms';
import { UserService } from '../../../../services/sync/user.service';
@Component({
  selector: 'app-add-people',
  templateUrl: './add-people.component.html',
  styleUrls: ['./add-people.component.css']
})
export class AddPeopleComponent implements OnInit {

  peopleForm: FormGroup;
  errorMsg:boolean=false;
  result: any;
  isbuttondisable: Boolean = false;
  user_result: any;
  user_emails:any;
  room_id:any;
  constructor(private apiService: ApiService, @Inject(MAT_DIALOG_DATA) public getdata: any, private fb: FormBuilder,  public dialogRef: MatDialogRef<AddPeopleComponent>, private router:Router, private syncVar: UserService) { 
  	 this.peopleForm = fb.group({
	      'room_people': [null, Validators.compose([Validators.required])]
	  });
  }

  ngOnInit() {
    this.room_id = this.getdata.room_id;
  	this.userlists();
  }
 
   peopleSubmit(post){
    this.errorMsg = false;
     if (this.peopleForm.valid) {
       var datas = {   user: this.apiService.decodejwts().userid,
                id: this.room_id,
                email: post.room_people.toString(),
                type: 'add'
              };
       this.apiService.putRequest(constant.apiurl + constant.addpeople, datas).subscribe(
        data => {
            this.result = data;
            this.syncVar.snackMessage('User has been added successfully.');
            this.isbuttondisable = true;
            this.dialogRef.close('close');
              setTimeout(() => {
                this.isbuttondisable = false;
            }, 2000);
      });
     }else{
       this.errorMsg = true;
     }
  }

  userlists() {

    const userlists = constant.apiurl + constant.roomproposal + '?user=' + this.apiService.decodejwts().userid + '&type=' + this.apiService.decodejwts().user_type + '&room=' + this.room_id;
    this.apiService.getRequest(userlists).subscribe(
      row => {
        this.user_result = row;
        this.user_emails = this.user_result.body;
      },
      err => {
        console.log(err);
      });
  }


  geterrorMsg(field) {
  	return this.peopleForm.controls[field].hasError('required') ? 'Field is required' : '';
  }

   onCancel(){
    this.dialogRef.close('cancel');
  }

}
