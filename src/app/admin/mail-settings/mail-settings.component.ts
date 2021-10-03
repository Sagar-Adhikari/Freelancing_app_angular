import { Component, OnInit } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatTableDataSource, MatPaginator, MatSort, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatIcon, PageEvent } from '@angular/material';
import { UserService } from '../../services/sync/user.service';
import { ApiService } from '../../services/api/api.service';
import { constant } from '../../../data/constant';
import * as Quill from 'quill';

@Component({
  selector: 'app-mail-settings',
  templateUrl: './mail-settings.component.html',
  styleUrls: ['./mail-settings.component.css']
})
export class MailSettingsComponent implements OnInit {

  mailsettingsForm: FormGroup;
  queryUserID = this.apiService.decodejwts().userid;
  errorAccountMsgArr:any = [];
  mailtemplate:any;
  constructor( private fb: FormBuilder,
    public dialog: MatDialog,
    private snackbar: MatSnackBar,
    private apiService: ApiService,
    private router: Router) { 
    this.mailsettingsForm = fb.group({
      'mailkey': new FormControl('',Validators.required),
      'subject': new FormControl(''),
      'Messege':new FormControl('')
    });
  }

  ngOnInit() {
    this.maildefaultkeys();
  }
  maildefaultkeys(){
    this.apiService.getRequest(constant.apiurl + constant.mailtemplate)
    .subscribe(data => {
      if(data['body'].results){
        this.mailtemplate = data['body'].results;
      }
    },err=>console.log(err))
  }
  geterrorAccountMsg(field) {
    return this.mailsettingsForm.controls[field].hasError('required') ? 'Field is required' : '';
  }
  getmailtempID:number;
  onchangeevent(event){
    this.mailtemplate.map(temp => {
     
      if(temp.key == event.value){
        this.getmailtempID = temp.id;
        this.mailsettingsForm.patchValue({
          'subject': temp.subject,
          'Messege' : temp.mail_content
        });
      }
    })
   
  }
  MailSubmit(formData) {
    let params:any = { 'key': formData.mailkey,
                       'subject': formData.subject.trim(),
                       'mail_content': formData.Messege.trim()
                      };

    if(this.mailsettingsForm.valid){

        this.apiService.putRequest(constant.apiurl + constant.mailtemplate +  this.getmailtempID + '/',params)
          .subscribe(data => {
            this.maildefaultkeys();
            this.snackbar.open("Updated Successfully");
              setTimeout(() => {
                this.snackbar.dismiss();
                this.router.navigate(['/admin/mail_settings']);
              }, 1500); 
          },err => {
            this.snackbar.open("Error");
              setTimeout(() => {
                this.snackbar.dismiss();
              }, 1500); 
          })

    }else{
      this.snackbar.open("Not valid");
				setTimeout(() => {
					this.snackbar.dismiss();
				}, 1500); 
    }
  }
  nowhitespace(e){
    //this function not allow space
    if (e.which == 32){
      return false;
    }
  }
 

}
