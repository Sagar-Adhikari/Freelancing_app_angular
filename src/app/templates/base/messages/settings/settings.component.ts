import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../../../../services/api/api.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatAutocomplete } from '@angular/material';
import { constant } from '../../../../../data/constant';
import { FormBuilder, FormGroup ,Validators, FormControl, DefaultValueAccessor, FormArray } from '@angular/forms';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  settingsForm: FormGroup;

  message_type = [
  {'value': 'all', 'viewValue': 'All'},
  {'value': 'nothing', 'viewValue': 'Nothing'}
  ];

  message_cron = [
  {'value': '1', 'viewValue': 'Immediate'},
  {'value': '2', 'viewValue': 'Every 15 Minutes'},
  {'value': '3', 'viewValue': 'Once an hour'},
  {'value': '4', 'viewValue': 'Once a day'}
  ];
  
  audio:any;
  errorMsg:boolean=false;
  result: any;
  isbuttondisable: Boolean = false;
  settings_result: any;
  href:any;
  constructor(private apiService: ApiService, @Inject(MAT_DIALOG_DATA) public getdata: any, private fb: FormBuilder,  public dialogRef: MatDialogRef<SettingsComponent>, private router:Router) { 

    this.settingsForm = fb.group({
      'play_sound': ['yes'],     
      'cron_status': [null],
      'cron_type': [null],
      'cron_send_status': [null],
      'message_type': [null]
    });

  }

  ngOnInit() {
    this.href = this.router.url;
    this.getSettings();
  }

  testsound(){
  	this.audio = new Audio();
    this.audio.src = "assets/sound/to-the-point.mp3";
    this.audio.load();
    this.audio.play();
  }

  getSettings(){
    const userlists = constant.apiurl + constant.msgsettings + '?user=' + this.apiService.decodejwts().userid + '&type=' + this.apiService.decodejwts().user_type;
    this.apiService.getRequest(userlists).subscribe(
      row => {
        this.settings_result = row;
        localStorage.setItem('sound_status', this.settings_result.body['0'].sound_status);
        localStorage.setItem('message_type', this.settings_result.body['0'].message_type);
        this.settingsForm.patchValue({
          'play_sound': this.settings_result.body['0'].sound_status,     
          'cron_status': this.settings_result.body['0'].cron_status,
          'cron_type': this.settings_result.body['0'].cron_type,
          'cron_send_status': this.settings_result.body['0'].send_status,
          'message_type': this.settings_result.body['0'].message_type
        });
      },
      err => {
        console.log(err);
      });
  }

  settingsSubmit(post){
    this.errorMsg = false;
     if (this.settingsForm.valid) {
       var sound;
       sound = 'no';
       if(post.play_sound!=null){
         sound = 'yes';
       }

       var send;
       send = 'no';
       if(post.cron_send_status!=null){
         send = 'yes';
       }
       var type = post.cron_type;
       if(post.cron_type==null){
         type = '';
       }

       localStorage.setItem('message_type', post.message_type);

       var datas = {   user: this.apiService.decodejwts().userid,
                sound_status: sound,
                send_status: send,
                cron_status: post.cron_status,
                cron_type: type,
                message_type: post.message_type,
              };
       this.apiService.putRequest(constant.apiurl + constant.savechatsettings, datas).subscribe(
        data => {
            this.result = data;
            if (this.result.status) {
               this.isbuttondisable = true;
                setTimeout(() => {
                  this.isbuttondisable = false;
                }, 2000);
            } else {
              if (this.router.url.indexOf('/chat-room') > -1) {
                this.router.navigate([this.href]);
              }
              this.dialogRef.close('close');
            }
      });
     }else{
       this.errorMsg = true;
     }
  }

  onCancel(){
    this.dialogRef.close('cancel');
  }
}
