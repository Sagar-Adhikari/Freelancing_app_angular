import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ApiService } from '../../../services/api/api.service';
import { constant } from '../../../../data/constant';
import { country } from '../../../../data/country';
import {
  MatDialog
} from '@angular/material';
import { ViewpreviewComponent } from '../../../templates/base/jobdetail/viewpreview/viewpreview.component';


@Component({
  selector: 'app-detail-proposal',
  templateUrl: './detail-proposal.component.html',
  styleUrls: ['./detail-proposal.component.css']
})
export class DetailProposalComponent implements OnInit {
  job_id:any;
  proposalId: any;
  resProposalData: any;
  proposalDetails: any;
  countries: any = country.list;
  skillsDisplays: any;
  hiredLevel: any;
  textLength = 150;
  initialTextLength = 150;
  morelessText = 'More';
  jobDescrption: any;
  coverLetter: any;
  morelessCoverText = 'More';
  textCoverLength = 150;
  isLoaded=false;
  baseurl: any;
  hiredLevelTxt = { 'Entry' : 'I am looking for freelancers with the lowest rates',
    'Intermediate': 'I am looking for a mix of experience and value',
    'Expert': 'I am willing to pay higher rates for the most experienced freelancers'
  };

  attachmentFile = false;
  uploadedFileArr: any = [];
  attachment: any = [];
  filetype: any;
  image_url = constant.imgurl;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.proposalId = params['proposalid'];
    });
    this.baseurl = constant.siteBaseUrl;
    const url = constant.apiurl + constant.job_proposal + this.proposalId;
    this.apiService.getRequest(url).subscribe(
      row => {
        this.resProposalData = row;
        if (this.resProposalData.status === 200 && this.resProposalData.ok === true) {
          this.proposalDetails = this.resProposalData.body;
          this.isLoaded = true;
          this.skillsDisplays = this.resProposalData.body.skills !== '' ? this.resProposalData.body.skills.split(',') : [];
          this.hiredLevel = this.resProposalData.body.experience_level;
          this.jobDescrption = this.resProposalData.body.description;
          if ( this.jobDescrption.length < this.initialTextLength ) {
            this.morelessText = '';
          }
          this.coverLetter = this.resProposalData.body.cover_letter;
          if ( this.coverLetter.length < this.initialTextLength ) {
            this.morelessCoverText = '';
          }
          this.job_id = this.resProposalData.body.job_id;
          // attachments start
          this.attachmentFile = this.resProposalData.body.attachments !== '' ? true : false;
          if (this.resProposalData.body.attachments != '') {
            const initialUploadedFile = this.resProposalData.body.attachments.split(',');
            this.uploadedFileArr = initialUploadedFile;
            this.getAttachments();
          }
           // attachments end
        }
      }, err => {
        console.log(err);
    });
  }

  getAttachments(){
    if (this.uploadedFileArr.length > 0) {
      this.uploadedFileArr.forEach(element => {
        this.apiService.getRequest(constant.apiurl + constant.fileupload + element)
          .subscribe(resData => {
            // this.initialAttachement.push(responseData['body']);
            const edifiletype = resData['body']['file_ext'];
            if (edifiletype === 'image/jpeg' || edifiletype === 'image/jpg' || edifiletype === 'image/png' || edifiletype === 'image/gif' ) {
              this.filetype = 'img';
              // fileItem['tempimage'] = this.DomSan.bypassSecurityTrustResourceUrl(url);
            } else if (edifiletype === 'video/x-matroska' || edifiletype === 'video/mp4') {
              this.filetype = 'video';
            } else if (edifiletype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || edifiletype === 'application/msword') {
              this.filetype = 'doc';
            } else if(edifiletype == 'application/vnd.openxmlformats-officedocument.presentationml.presentation'){
              this.filetype = 'pptx';
            }else if (edifiletype === 'text/csv' || edifiletype === 'application/vnd.ms-excel') {
              this.filetype = 'csv';
            } else if (edifiletype === 'application/pdf') {
              this.filetype = 'pdf';
            } else if (edifiletype === 'application/x-php') {
              this.filetype = 'php';
            } else if (edifiletype === 'application/zip') {
              this.filetype = 'zip';
            } else if (edifiletype === 'text/vnd.trolltech.linguist' || edifiletype === 'application/javascript') {
              this.filetype = 'js';
            }  else if (edifiletype === 'application/sql') {
              this.filetype = 'sql';
            } else {
              this.filetype = 'none';
            }
            this.attachment.push({
              'id': resData['body']['id'],
              'file_name' : resData['body']['file_name'],
              'filetype' : resData['body']['file_ext'],
              'filepath' : this.image_url + resData['body']['file']
            });
            console.log(this.filetype);
            console.log(this.attachment);
          });
      });
    }
  }
  viewAttachment(file, ext) {
    console.log(file);
    console.log(ext);
    const dialogEditTitle = this.dialog.open(ViewpreviewComponent, {
      disableClose: true,
      data: {
        'file': file,
        'ext': ext
      }
    });
  }

  onMoreFun(textlength, findText) {
    if ( findText === 'More') {
      this.textLength = textlength;
      this.morelessText = 'Less';
    } else {
      this.textLength = 150;
      this.morelessText = 'More';
    }
    this.morelessText = this.morelessText;
    if ( this.jobDescrption.length < this.initialTextLength ) {
      this.morelessText = '';
    }
  }

  onCoverMoreFun(textlength, findText) {
    if ( findText === 'More') {
      this.textCoverLength = textlength;
      this.morelessCoverText = 'Less';
    } else {
      this.textCoverLength = 150;
      this.morelessCoverText = 'More';
    }
    this.morelessCoverText = this.morelessCoverText;
    if ( this.coverLetter.length < this.initialTextLength ) {
      this.morelessCoverText = '';
    }
  }
}
