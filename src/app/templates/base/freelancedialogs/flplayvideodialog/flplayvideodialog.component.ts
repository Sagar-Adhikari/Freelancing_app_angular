import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-flplayvideodialog',
  templateUrl: './flplayvideodialog.component.html',
  styleUrls: ['./flplayvideodialog.component.css']
})
export class FlplayvideodialogComponent implements OnInit {
  video_url: any;
  is_video = false;

  constructor(
    public dialogRef: MatDialogRef<FlplayvideodialogComponent>,
    @Inject(MAT_DIALOG_DATA) public getdata: any,
    private sanitizer: DomSanitizer
  ) {
    const video_url_id = this.getId(this.getdata.content.video);
    if (video_url_id !== 'error') {
      this.is_video = true;
      this.video_url = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + video_url_id);
    } else {
      this.is_video = false;
    }
  }

  ngOnInit() {
  }
  // get video ID from youtube URL
  getId(url) {
    if(url == null){
      return 'error';
    }else{
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      if (match && match[2].length == 11) {
          return match[2];
      } else {
          return 'error';
      }
    }
    
  }

  onclickcancel() {
    this.dialogRef.close('cancel');
  }
}
