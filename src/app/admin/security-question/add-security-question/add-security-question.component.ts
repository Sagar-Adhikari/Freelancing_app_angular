import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup ,Validators, FormControl, DefaultValueAccessor } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api/api.service';
import { constant } from '../../../../data/constant';
import { Title, Meta, DOCUMENT, DomSanitizer } from '@angular/platform-browser';
import { environment } from '.././../../../environments/environment';

@Component({
  selector: 'app-add-security-question',
  templateUrl: './add-security-question.component.html',
  styleUrls: ['./add-security-question.component.css']
})
export class AddSecurityQuestionComponent implements OnInit {

  secqtnForm:FormGroup;
  isbuttondisable:boolean = false;
  ismessage:boolean = false;
  is_success:boolean = false;
  errormessage:string = "";
  queryUserID = this.api.decodejwts().userid; // logged user id
  constructor(public sanitizer:DomSanitizer, formbuilder:FormBuilder, private api : ApiService, private router:Router, @Inject(DOCUMENT) private document: HTMLDocument,
      private titleService: Title, 
      private route:ActivatedRoute ) {
    this.secqtnForm = formbuilder.group({
      'sec_qtn_name' : [null, Validators.compose([Validators.required, this.noWhitespaceValidator, Validators.minLength(3)])],
      'sec_qtn_status' : ['Active', Validators.compose([Validators.required])]              
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

  secqtnFormSubmit(formData) {
    if(this.secqtnForm.valid) {
            
          var href = constant.apiurl+constant.adminsecqtnurl;
          var params = {
                  question: formData.sec_qtn_name.trim(),
                  status:formData.sec_qtn_status,
                  user:this.queryUserID
                };
          this.api.postRequest(href,params).subscribe(result => {
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
  	if(this.secqtnForm.controls['sec_qtn_name'].hasError('required') || this.secqtnForm.controls['sec_qtn_status'].hasError('required')) {
  		this.errormessage =  'Fields are required';
  	}else if(this.secqtnForm.controls['sec_qtn_name'].hasError('whitespace') || this.secqtnForm.controls['sec_qtn_name'].hasError('minlength')){
  		this.errormessage= 'Question must be at least 3 characters long.';
  	}
  }

  showSuccess() {
    this.is_success = true;
    setTimeout(() => {
        this.router.navigate(['/admin/security-questions']);
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

}
