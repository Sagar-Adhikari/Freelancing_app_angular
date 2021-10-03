import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup ,Validators, FormControl, DefaultValueAccessor } from '@angular/forms';
import { HttpHeaders, HttpResponse, HttpXsrfTokenExtractor, HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from '../../../services/api/api.service';
import { constant } from '../../../../data/constant';
import { Title, Meta, DOCUMENT } from '@angular/platform-browser';
import { environment } from '.././../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-edit-membership',
  templateUrl: './edit-membership.component.html',
  styleUrls: ['./edit-membership.component.css']
})
export class EditMembershipComponent implements OnInit {

  editMembership:FormGroup;
  isbuttondisable:boolean = false;
  ismessage:boolean = false;
  is_success:boolean = false;
  errormessage:string = "";
  successmsg:string = "";
  result:any;
  items:any;
  tag_list = [];
  results:any;
  interval_type_select:any = [
    {"type":"day","name":"Days"},
    {"type":"month","name":"Months"},
    {"type":"year","name":"Years"}
  ];

  constructor(private sanitizer:DomSanitizer, formbuilder:FormBuilder, private api : ApiService, private router:Router, @Inject(DOCUMENT) private document: HTMLDocument,
      private titleService: Title, 
      private route:ActivatedRoute ) {
    this.editMembership = formbuilder.group({
      'membership_name' : [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'membership_desc' : [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'allowed_connects' : [null, Validators.compose([Validators.required])]   
    });
  }

  noWhitespaceValidator(control: FormControl) {
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true }
  }

  ngOnInit() {
     this.updatePageInfo();
     this.getIndivualDetails();
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

  public get authHeader(): string {
    return `JWT ${localStorage.getItem('exp_token')}`;
  }
  setHeaders() {
    return {
      headers: new HttpHeaders().set('Authorization', this.authHeader)
    };
  }

  getIndivualDetails() {

    const id = this.route.snapshot.paramMap.get('id');
    var url = constant.apiurl+constant.adminmembership+id+'/';
    this.api.getRequest(url).subscribe(result => {
    	this.results = result;
	 },error => {
	    this.errormessage = error.error.non_field_errors["0"];
	    this.showError();
	 },() => {
	 	this.editMembership.patchValue({
        'membership_name': this.results.body.membership_name,
        'membership_desc':this.results.body.membership_statement,
        'allowed_connects': this.results.body.membership_connect
      });
	 });
  }

  editMembershipSubmit(formData) {
    // Unique mail&username validation and data save functionality
    if(this.editMembership.valid) {
        const id = this.route.snapshot.paramMap.get('id'); 
    	var href = constant.apiurl+constant.adminmembership+id+'/';
    	var params = {
	      	membership_name:formData.membership_name.trim(),
	      	membership_statement:formData.membership_desc.trim(),
	        membership_connect: formData.allowed_connects,
	      	id:id
	     };

    	 this.api.putRequest(href,params).subscribe(result => {
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
     if(this.editMembership.controls['membership_name'].hasError('whitespace') || this.editMembership.controls['membership_name'].hasError('required') 
    || this.editMembership.controls['membership_desc'].hasError('whitespace') || this.editMembership.controls['membership_desc'].hasError('required') 
    || this.editMembership.controls['membership_days'].hasError('whitespace') || this.editMembership.controls['membership_days'].hasError('required')
    ) {
      this.errormessage =  'Fields are required';
    }else if(this.editMembership.controls['membership_days'].hasError('pattern')){
      this.errormessage =  'Membership Days Allows number only';
    }
  }

  _keyPress(event: any) {
	    const pattern = /[0-9\+\-\ ]/;
	    let inputChar = String.fromCharCode(event.charCode);
	    if (!pattern.test(inputChar)) {
	      event.preventDefault();
	    }
	}

  showSuccess() {
    this.is_success = true;
    setTimeout(() => {
        this.router.navigate(['/admin/membership']);
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
