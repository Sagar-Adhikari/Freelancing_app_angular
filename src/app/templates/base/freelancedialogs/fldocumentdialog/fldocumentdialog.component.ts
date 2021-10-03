import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';

import { ApiService } from '../../../../services/api/api.service';
import { constant } from '../../../../../data/constant';

@Component({
  selector: 'app-fldocumentdialog',
  templateUrl: './fldocumentdialog.component.html',
  styleUrls: ['./fldocumentdialog.component.css']
})
export class FldocumentdialogComponent implements OnInit {

  // Document Form - start
  documentEditForm: FormGroup;
  displayDocumentEditForm = false;
  responseData: any = [];
  errorDocumentMsg = '';
  errorDocumentMsgArr: any;
  urls = [];
  multifile = [];
  // Document Form - end

  constructor(
  	formBulider: FormBuilder,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<FldocumentdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public getdata: any,
   ) { 
   	this.documentEditForm = formBulider.group({
      'document': [null, Validators.compose([Validators.required])],
    });
   }

  ngOnInit() {
  }

  deleteDisplayedimg(event){
    this.multifile.splice(event,1)
    this.urls.splice(event,1)
  }

    
  onSelectFile(event) {
    const fileTypeArray = ['png', 'jpeg', 'jpg', 'pdf', 'doc', 'docx']; // upload only png, jpeg & jpg
    // this.urls = [];
    // this.multifile = [];
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        this.errorDocumentMsg = '';
        this.errorDocumentMsgArr = [];
        var fileName = event.target.files[i].name;
        var fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
        if (fileTypeArray.some(x => x === fileExtension)) {
          if(fileExtension == 'pdf'){
            this.urls.push('assets/images/pdf.png'); 
          }else if(fileExtension == 'doc' || fileExtension == 'docx'){
            this.urls.push('assets/images/doc.png'); 
          }else{
            const fileReader: FileReader = new FileReader();
            //const reader = new FileReader();
            fileReader.onload = (event: Event) => {
              this.urls.push(fileReader.result); 
            }
            fileReader.readAsDataURL(event.target.files[i]);
          }
          this.multifile.push(event.target.files[i]);
          console.log(this.multifile)
          // console.log(this.urls);
        }else{
          this.errorDocumentMsg = 'error';
          this.errorDocumentMsgArr['document'] = 'Please upload valid files PNG, JPG, PDF and DOC ';
          break;
        }
      }
    }
  }

  documentEditSubmit(formData) {
// console.log(this.multifile.length)
    if(this.multifile.length < 1){
      console.log("Empty data");
      return false;
    }else if(this.errorDocumentMsgArr['document'] !== undefined && this.multifile.length < 1){
      console.log('has error')
      return false;
    }else{
      this.errorDocumentMsg = '';
      this.errorDocumentMsgArr = [];
    }
    
    const frmData = new FormData();
    if (this.documentEditForm.valid) {
      for (var i = 0; i < this.multifile.length; i++) { 
        frmData.append("file", this.multifile[i]);
      }
      console.log(frmData)
      frmData.append("user",this.getdata.user_id);
      this.apiService.postRequest(constant.apiurl + constant.uploadDocument, frmData).subscribe(
      data => {
        this.responseData = data;
        if (this.responseData.body !== '') {
          this.dialogRef.close({'status': 'success'});
        }
      }, err => {
        this.errorDocumentMsg = 'error';
        this.errorDocumentMsgArr['document'] = err.error.document;
      });
    } else {
      this.errorDocumentMsg = 'error';
    }
  }

  geterrordocumentMsg(field) {
    return this.documentEditForm.controls[field].hasError('required') ? 'Field is required' :
      this.documentEditForm.controls[field].hasError('document') ? 'Please upload document' : '';
  }

  onclickcancel() {
    this.dialogRef.close('cancel');
  }
}
