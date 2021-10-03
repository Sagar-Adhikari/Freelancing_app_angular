import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, DefaultValueAccessor } from '@angular/forms';
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
  selector: 'app-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.css']
})
export class AddRoomComponent implements OnInit {

  addRoom: FormGroup;
  isbuttondisable: boolean = false;
  ismessage: boolean = false;
  is_success: boolean = false;
  errormessage: string = "";
  successmsg: string = "";
  tag: Observable < any > ;
  result: any;
  user_result: any;
  items: any;
  results: any;
  user_emails:any;
  constructor(private sanitizer: DomSanitizer, formbuilder: FormBuilder, private api: ApiService, private router: Router, @Inject(DOCUMENT) private document: HTMLDocument,
    private titleService: Title,
    private route: ActivatedRoute, private dialogRef: MatDialogRef < AddRoomComponent > ) {
    this.addRoom = formbuilder.group({
      'room_name': [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'room_people': [null, Validators.compose([Validators.required])],
      'room_message': [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
    });
  }

  noWhitespaceValidator(control: FormControl) {
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true }
  }

  ngOnInit() { this.userlists(); }

  addRoomSubmit(formData) {
    // Unique mail validation and data save functionality
    if (this.addRoom.valid) {
      var href = constant.apiurl + constant.roomlisting;
      var params = {
        room_name: formData.room_name.trim(),
        room_message: formData.room_message.trim(),
        invite_users: formData.room_people.toString(),
        user: this.api.decodejwts().userid,
        room_type: 'Chat'
      };
      this.api.postRequest(href, params).subscribe(result => {
        this.results = result;
      }, error => {
        this.errormessage = error.error.invite_users["0"];
        this.showError();
      }, () => {
        this.savemsg(this.results.id, this.results.room_message);
        this.showSuccess();
      });
    } else {
      this.getFormMessage();
      this.showError();
    }
  }

  savemsg(room_id, msg) {
    var uploadedFile = [];
    var prevQteMsginfo = []
    var href = constant.apiurl + constant.msglisting;
    var params = {
      room: room_id,
      chat_message: msg,
      file: JSON.stringify(uploadedFile),
      message: JSON.stringify(prevQteMsginfo),
      user: this.api.decodejwts().userid
    };
    this.api.postRequest(href, params).subscribe(result => {}, error => {
      this.errormessage = error.error.non_field_errors["0"];
      this.showError();
    }, () => {
      this.router.navigate(['/chat-room/' + room_id]);
      // this.showSuccess();   
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


  onCancel() {
    this.dialogRef.close('cancel');
  }
  
  getFormMessage() {
    if (this.addRoom.controls['room_name'].hasError('whitespace') || this.addRoom.controls['room_name'].hasError('required') ||
      this.addRoom.controls['room_message'].hasError('whitespace') || this.addRoom.controls['room_message'].hasError('required') ||
      this.addRoom.controls['room_people'].hasError('whitespace') || this.addRoom.controls['room_people'].hasError('required')
    ) {
      this.errormessage = 'Fields are required';
    }
  }

  showSuccess() {
    this.is_success = true;
    setTimeout(() => {
      // this.router.navigated = false;
      // this.router.navigate(['/messages']);
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
    }, 3000);
  }
}
