import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup ,Validators, FormControl, DefaultValueAccessor } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../services/api/api.service';
import { constant } from '../../../../../data/constant';
import { Title, Meta, DOCUMENT, DomSanitizer } from '@angular/platform-browser';
import { environment } from '../.././../../../environments/environment';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {

  categoryForm:FormGroup;
  isbuttondisable:boolean = false;
  ismessage:boolean = false;
  is_success:boolean = false;
  errormessage:string = "";

  //fileupload
  url = [];
  pushFiles = [];
  msgFiles = new FormData();
  file_info_all = [];
  uploadedFile = [];
  uploadinfo:any;
  constructor(public sanitizer:DomSanitizer, formbuilder:FormBuilder, private api : ApiService, private router:Router, @Inject(DOCUMENT) private document: HTMLDocument,
      private titleService: Title, 
      private route:ActivatedRoute) {
    this.categoryForm = formbuilder.group({
      'category_name' : [null, Validators.compose([Validators.required, this.noWhitespaceValidator, Validators.minLength(3)])],
      'category_status' : ['Active', Validators.compose([Validators.required])]              
    });
  }

  noWhitespaceValidator(control: FormControl) {
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true }
  }

  ngOnInit() {
    this.updatePageInfo();
  }

  updatePageInfo() {
    // this.api.initmeta(constant.apiurl+constant.meta_url).subscribe(
    //   (row) => {
    //     this.document.getElementById('appFavicon').setAttribute('href', constant.apiurl+'images/user/'+row.fav_icon);
    //     this.setTitle(row.app_name + environment.titlePrefix + this.route.snapshot.data.title);
    //   }
    //   );
  }
    // project title updation
    setTitle( newTitle: string) {
      this.titleService.setTitle( newTitle );
    }

  categoryFormSubmit(formData) {
    if(this.categoryForm.valid) {
            
          var href = constant.apiurl+constant.admincategorylist;
          var params = {
                  name: formData.category_name.trim(),
                  status:formData.category_status
                };

           if(this.url.length>0){
            this.doUploads().then(
            (val) => {
              params['attachments'] = JSON.stringify(this.file_info_all);
              this.saveCategory(params);
            },(err) => { console.error(err); });
          }else{
            this.saveCategory(params);
          }
    } else {
      this.getFormMessage();
      this.showError();
    }
  }

  saveCategory(datas){
    var href = constant.apiurl+constant.admincategorylist;
    this.api.postRequest(href,datas).subscribe(result => {
    },error => {
      this.errormessage = error.error.non_field_errors["0"];
      this.showError();
    },() => {
      this.showSuccess();   
    });
  }

  getFormMessage () {
  	if(this.categoryForm.controls['category_name'].hasError('required') || this.categoryForm.controls['category_status'].hasError('required')) {
  		this.errormessage =  'Fields are required';
  	}else if(this.categoryForm.controls['category_name'].hasError('whitespace') || this.categoryForm.controls['category_name'].hasError('minlength')){
  		this.errormessage= 'Category name must be at least 3 characters long.';
  	}
  }

  showSuccess() {
    this.is_success = true;
    setTimeout(() => {
        this.router.navigate(['/admin/jobs/categorys']);
        this.is_success = false;
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

  readUrl(event:any) {
    if (event.target.files.length>0) {
      this.url.length = 0;
      this.pushFiles.length = 0;
      for (var i = event.target.files.length - 1; i >= 0; i--) {
        // this.msgFiles = new FormData();
        var file_ext = event.target.files[i].name.split('.').pop(); 
        var file_type = event.target.files[i].type;
        var file_size = event.target.files[i].size;
        var file_name = event.target.files[i].name;

        var img_type = ['image/gif', 'image/jpeg',  'image/jpg', 'image/png'];
        if(img_type.indexOf(file_type) > -1){
          const u = (window.URL) ? window.URL.createObjectURL(event.target.files[i]) : (window as any).webkitURL.createObjectURL(event.target.files[i]);
          this.url.push({'img': this.sanitizer.bypassSecurityTrustResourceUrl(u) , 'size': event.target.files[i].size, 'file_name': event.target.files[i].name});

        }
        
        this.pushFiles.push(event.target.files[i]);
      }
    }
  }

  doUploads() {
    const rm = this.pushFiles.length-1;
    var promise = new Promise((resolve, reject) => {
      if(this.url.length>0){
        const msgFiles = new FormData();
        for (var i = 0; i < this.pushFiles.length; i++) {
          this.msgFiles.append('file', this.pushFiles[i]);
          this.msgFiles.append('user', this.api.decodejwts().userid);
          this.msgFiles.append('type', 'Category');
          this.msgFiles.append('file_name', this.pushFiles[i].name);
          this.msgFiles.append('file_ext', this.pushFiles[i].type);
          this.msgFiles.append('file_size', this.pushFiles[i].size);

          this.api.uploadFile(constant.apiurl + constant.fileupload, this.msgFiles).subscribe(
            data => {
              this.uploadinfo = data;
              this.file_info_all.push(this.uploadinfo);
              this.uploadedFile.push(this.uploadinfo.id);
            },
            err => {
              console.log('something went wrong');
            }
            );

          setTimeout(() => {
            resolve();
          }, 800);
        }      
      }    
    });

    return promise;
  }

  removefiles(id){
    this.url.splice(id, 1);
    this.pushFiles.splice(id, 1);
  }

}
