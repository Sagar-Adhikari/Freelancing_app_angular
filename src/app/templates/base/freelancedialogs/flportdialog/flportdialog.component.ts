import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as moment from 'moment';
import { FileUploader } from 'ng2-file-upload'; /* file upload */
import { DomSanitizer } from '@angular/platform-browser';

import { ApiService } from '../../../../services/api/api.service';
import { UserService } from '../../../../services/sync/user.service';
import { constant } from '../../../../../data/constant';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-flportdialog',
  templateUrl: './flportdialog.component.html',
  styleUrls: ['./flportdialog.component.css']
})
export class FlportdialogComponent implements OnInit {
  portForm: FormGroup;
  categoryname = '';
  popupTitle;
  subcategorylist: any;
  assubcategorylist: any;
  allCategory: any;
  responseData;
  // error message
  errorMsg = '';
  errorMsgArr: any = [];
  formDataAssign: any;
  fileUploaded = false;
  /* file upload */
  attachment: any = [];
  baseurl:any;
  thumbImageForm;
  fileName;
  fileType;
  filetype;
  uploadedFileId: any = [];
  newUploadFileID: any = [];
  uploadedFileIdString = '';
  afterFileUploadProcessed = 0;
  sizeOfUploadedFile = 0;
  thumbimgvalue;
  image_url = constant.imgurl;
  public uploader: FileUploader = new FileUploader({
    url: constant.apiurl + constant.fileupload,
    headers: [{
      name: 'Authorization',
      value: this.authHeader
    }],
    additionalParameter: {
      user: this.getdata.user_id,
      type: 'Jobs'
    }
  });
  public get authHeader(): string {
    return `JWT ${localStorage.getItem('exp_token')}`;
  }
  /* file upload */

  /* Thumbnail Image upload */
  file: File;
  uploadedThumbnail = '';

  constructor(
    formBulider: FormBuilder,
    private apiService: ApiService,
    private usersService: UserService,
    public dialogRef: MatDialogRef<FlportdialogComponent>,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public getdata: any,
    private DomSan: DomSanitizer
  ) {
    this.portForm = formBulider.group({
      'project_title': [this.getdata.project_title.trim(), Validators.compose([
        Validators.required,
        this.noWhitespaceValidator,
        Validators.maxLength(250)])],
      'project_categories': ['', Validators.compose([Validators.required])],
      'project_subcategories': [''],
      'project_url': [this.getdata.project_url, Validators.compose([Validators.pattern('https?://.+'), Validators.maxLength(200)])],
      'completion_date': [this.getdata.completion_date, Validators.compose([Validators.required])],
      'skills': [this.getdata.skills],
      'project_overview': [this.getdata.project_overview.trim(), Validators.compose([
        Validators.required,
        this.noWhitespaceValidator,
        Validators.maxLength(250)])],
      'project_image': [''],
      'project_file': ['']
    });
  }
  deleteImg(event,index){
    if(confirm("Are you sure to delete ??")) {
      
      this.apiService.deleteRequest(constant.apiurl + constant.fileupload + event.id,'').subscribe(
      data => {
        this.onDeleteAttachment(index);
        this.usersService.snackMessage('Deleted successfully');
      }, err => {
        if(event.id == undefined){
          this.onDeleteAttachment(index);
          this.usersService.snackMessage('Deleted');
          return false;
        }
        this.usersService.snackMessage('Error');
      });
    }else{

    }
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  ngOnInit() {
  this.baseurl = constant.siteBaseUrl;
    this.getSubCategory();
    this.getAllCategory();
    this.popupTitle =  this.getdata.action === 'edit' ? 'Edit' : 'Add';
    this.categoryname = this.getdata.categoryname;
     /* file upload */

     this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
      form.append('file_name' , fileItem._file.name);
      form.append('file_ext' , fileItem._file.type);
     };

    this.uploader.onAfterAddingFile = (fileItem) => {
      const url = (window.URL) ? window.URL.createObjectURL(fileItem._file) : (window as any).webkitURL.createObjectURL(fileItem._file);
      fileItem.withCredentials = false;
      this.sizeOfUploadedFile = this.sizeOfUploadedFile + fileItem._file.size;
      // sizeOfUploadedFile
      // 10000000
      fileItem['file_name'] = fileItem._file.name;

      if (fileItem._file.type === 'image/png' || fileItem._file.type === 'image/jpeg' || fileItem._file.type === 'image/gif' || fileItem._file.type === 'image/gif' ) {
        fileItem['filetype'] = 'img';
        fileItem['filepath'] = this.DomSan.bypassSecurityTrustResourceUrl(url);
      } else if (fileItem._file.type === 'video/x-matroska' || fileItem._file.type ==='video/mp4') {
        fileItem['filetype'] = 'video';
      } else if (fileItem._file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileItem._file.type === 'application/msword') {
        fileItem['filetype'] = 'doc';
      } else if (fileItem._file.type === 'text/csv' || fileItem._file.type === 'application/vnd.ms-excel') {
        fileItem['filetype'] = 'csv';
      } else if (fileItem._file.type === 'application/pdf') {
        fileItem['filetype'] = 'pdf';
      } else if (fileItem._file.type === 'application/x-php') {
        fileItem['filetype'] = 'php';
      } else if (fileItem._file.type === 'application/zip') {
        fileItem['filetype'] = 'zip';
      } else if (fileItem._file.type === 'text/vnd.trolltech.linguist' || fileItem._file.type === 'application/javascript') {
        fileItem['filetype'] = 'js';
      }  else if (fileItem._file.type === 'application/sql') {
        fileItem['filetype'] = 'sql';
      } else {
        fileItem['filetype'] = 'none';
      }
      if (this.attachment.length < 5) {
        this.attachment.push(fileItem);
      } else {
        this.usersService.snackErrorMessage('You can only upload 5 files');
        return false;
      }
      if (this.getdata.portid != '') {
        fileItem.upload();
      }
    };

    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      const responsePath = JSON.parse(response);
      if (responsePath.id != '' && typeof responsePath.id != 'undefined') {
        this.afterFileUploadProcessed = this.afterFileUploadProcessed + 1;
        this.uploadedFileId.push(responsePath.id);
        if (this.uploadedFileId.length > 0) {
          this.uploadedFileIdString = this.uploadedFileId.toString();
        }
        if (this.attachment.length == this.afterFileUploadProcessed && this.getdata.portid == '') {
          this.formDataCallback(this.formDataAssign);
        }
      }
    };
    /* file upload */
    if (this.getdata.project_categories !== '' && this.getdata.project_categories != null ) {
      this.onchangeallcategory(this.getdata.project_categories, 'no');
      this.portForm.controls['project_categories'].setValue(this.getdata.project_categories);
      this.portForm.controls['project_subcategories'].setValue(this.getdata.project_subcategories);
    }
    if (this.getdata.project_image !== '' && this.getdata.project_image != null ) {
      this.fileUploaded = false;
      this.uploadedThumbnail = this.getdata.project_image;
    }
    if (this.getdata.project_file != '' && this.getdata.project_file != null ) {
      const initialUploadedFile = this.getdata.project_file.split(',');
      this.uploadedFileId = initialUploadedFile;
      if (this.uploadedFileId.length > 0) {
        this.uploadedFileIdString = this.uploadedFileId.toString();

        this.uploadedFileId.forEach(element => {
          this.apiService.getRequest(constant.apiurl + constant.fileupload + element)
            .subscribe(responseData => {
              // this.initialAttachement.push(responseData['body']);
              const edifiletype = responseData['body']['file_ext'];
              console.log(edifiletype);
              if (edifiletype === 'image/jpeg' || edifiletype === 'image/jpg' || edifiletype === 'image/png' || edifiletype === 'image/gif') {
                this.filetype = 'img';
                // fileItem['tempimage'] = this.DomSan.bypassSecurityTrustResourceUrl(url);
              } else if (edifiletype === 'video/x-matroska' || edifiletype === 'video/mp4') {
                this.filetype = 'video';
              } else if (edifiletype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || edifiletype ===  'application/msword') {
                this.filetype = 'doc';
              } else if (edifiletype === 'text/csv' || edifiletype === 'application/vnd.ms-excel') {
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
              // if (this.attachment.length < 5) {
                    this.attachment.push({
                      'id': responseData['body']['id'],
                      'file_name' : responseData['body']['file_name'],
                      'filetype' : this.filetype,
                      'filepath' : this.image_url + responseData['body']['file']
                    });
                      // console.log(this.attachment)
                // } else {
                //   // this.usersService.snackErrorMessage('You can only upload 5 files');
                //   return false;
                // }
                
            });
        });
      }
    }
  }

  // Get SUbcategory based previous main category selection
  getSubCategory() {
    this.apiService.getRequest(constant.apiurl + constant.job_subcategory_all + '?category=' + localStorage.getItem('category'))
      .subscribe(responseData => {
        this.subcategorylist = responseData['body'];
      });
  }
  // Get All Category List
  getAllCategory() {
    this.apiService.getRequest(constant.apiurl + constant.job_category_all + '?search=')
      .subscribe(responseData => {
        this.allCategory = responseData['body'];
      });
  }

  onchangeallcategory(category = '', code = '') {
    if ( code !== 'no' ) {
      this.categoryname = this.allCategory.find(row => row.id === category).name;
    }
    this.apiService.getRequest(constant.apiurl + constant.job_subcategory_all + '?category=' + category)
      .subscribe(responseData => {
        this.assubcategorylist = responseData['body'];
      });
  }

  changeDateEvent(e) {
    this.portForm.controls['completion_date'].setValue(moment(e.value, 'L', true).format('YYYY-MM-DD'));
  }

  onclickcancel() {
    this.dialogRef.close('cancel');
  }

  onDeleteAttachment(index) {
    if (this.getdata.portid == '') {
      this.attachment.splice(index, 1);
    } else {
      if (this.attachment.length > 0) {
        this.attachment.splice(index, 1);
        this.newUploadFileID = [];
        this.attachment.forEach(element => {
          this.newUploadFileID.push(element.id);
        });
        this.uploadedFileIdString = this.newUploadFileID.toString();
      }
    }
  }

  savePortForm(formData) {
    if (this.uploadedThumbnail === '') {
      this.fileUploaded = true;
    } else {
      this.fileUploaded = false;
    }
    this.formDataAssign = formData;
    if (this.portForm.valid) {
      if (this.uploadedThumbnail === '') {
        this.fileUploaded = true;
        return false;
      }
      // After file uploads submit form
      if (this.attachment.length > 0 && this.getdata.portid == '') {
        this.attachment.forEach(file => {
          file.upload();
        });
      } else {
        this.formDataCallback(this.formDataAssign);
      }
    } else {
      this.errorMsg = 'error';
    }
  }

  changeLogo(e) {
    const fileTypeArray = ['png', 'jpeg', 'jpg']; // upload only png, jpeg & jpg
    this.file = e.target.files[0];
    this.thumbImageForm = new FormData();
    // get file name from uploaded file
    const fileName = this.file.name;
    const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);

    if (fileTypeArray.some(x => x === fileExtension) && this.file.size < 3000000) {
      this.thumbImageForm.append('file', this.file, this.file.name);
      this.thumbImageForm.append('user', this.getdata.user_id);
      this.thumbImageForm.append('type', 'Jobs');
      this.thumbImageForm.append('file_name', 'fileName');
      this.thumbImageForm.append('file_ext', 'fileExtension');
      this.apiService.postRequest(constant.apiurl + constant.fileupload, this.thumbImageForm).subscribe(
        data => {
          console.log(data);
          this.uploadedThumbnail = this.image_url + data['file'];
          this.fileUploaded = false;
        },
        err => {
          e.target.value = '';
          this.uploadedThumbnail = '';
          this.fileUploaded = true;
        }
      );
    } else {
      e.target.value = '';
      this.fileUploaded = true;
    }
    console.log(this.uploadedThumbnail);
  }

  public fileSelected(e: any): void {
  }

  formDataCallback(formData) {
    formData['project_file'] = this.uploadedFileIdString;
    formData['project_image'] = this.uploadedThumbnail;
    const params = {
      'user': this.getdata.user_id,
      'completion_date': formData.completion_date,
      'category_name': this.categoryname,
      'project_categories': formData.project_categories,
      'project_file': this.uploadedFileIdString,
      'project_image': this.uploadedThumbnail,
      'project_overview': formData.project_overview,
      'project_subcategories': formData.project_subcategories,
      'project_title': formData.project_title,
      'project_url': formData.project_url,
      'skills': formData.skills
    };
    if (this.getdata.action === 'edit') {
      this.apiService.putRequest(this.getdata.api_url + this.getdata.update_url + this.getdata.portid + '/' , params ).subscribe(
        data => {
          this.responseData = data;
          if (this.responseData.body !== '') {
            this.dialogRef.close({'status': 'success', 'action': this.getdata.action});
          }
        }, err => {
          console.log(err);
      });
    } else {
      this.apiService.postRequest(this.getdata.api_url + this.getdata.update_url, params ).subscribe(
        data => {
          this.responseData = data;
          if (this.responseData.body !== '') {
            this.dialogRef.close({'status': 'success', 'action': this.getdata.action});
          }
        }, err => {
            if (err.error.project_url.length > 0) {
              this.errorMsg = 'error';
              this.errorMsgArr['project_url'] = 'Please enter valid url';
            }
      });
    }
  }

  geterrorMsg(field) {
    if ( field === 'project_url' ) {
      return this.portForm.controls[field].hasError('pattern') ? 'Please enter valid url' :
      this.portForm.controls[field].hasError('maxlength') ? 'Field only accept 200 character' : '';
    } else {
      return this.portForm.controls[field].hasError('required')
      || this.portForm.controls[field].hasError('whitespace') ? 'Field is required' :
      this.portForm.controls[field].hasError('maxlength') ? 'Field only accept 250 character' : '';
    }
  }
}
