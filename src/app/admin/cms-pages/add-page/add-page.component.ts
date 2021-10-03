import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup ,Validators, FormControl, DefaultValueAccessor, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api/api.service';
import { constant } from '../../../../data/constant';
import { Title, Meta, DOCUMENT, DomSanitizer } from '@angular/platform-browser';
import { environment } from '.././../../../environments/environment';
import * as Quill from 'quill';

@Component({
  selector: 'app-add-page',
  templateUrl: './add-page.component.html',
  styleUrls: ['./add-page.component.css']
})
export class AddPageComponent implements OnInit {

    cmsaddForm:FormGroup;
	isbuttondisable:boolean = false;
	ismessage:boolean = false;
	is_success:boolean = false;
	errormessage:string = "";
	data:any;
    isDescription: boolean = false;
	gp_data:any;
	result = [];
	gp_result = [];
	selected_group_value:any;
	answer_value:number;
	constructor(public sanitizer:DomSanitizer, public formbuilder:FormBuilder, private api : ApiService, private router:Router, @Inject(DOCUMENT) private document: HTMLDocument,
		private titleService: Title, 
		private route:ActivatedRoute ) {
		this.cmsaddForm = formbuilder.group({
			'cms_title' : [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
			'cms_desc' : [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
			'cms_slug' : [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
			'cms_alias' : [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
			'cms_meta_desc' : [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
			'cms_meta_key' : [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
			'cms_guest' : ['Yes', Validators.compose([Validators.required])],
			'cms_status' : ['Active', Validators.compose([Validators.required])]              
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
    
    cmsaddFormSubmit(formData) {
    	if(this.cmsaddForm.valid) {
    		var slug = formData.cms_slug.toLowerCase().trim();
    		slug = slug.replace(/[^a-z0-9\s-]/g, '');
    		slug = slug.replace(/[\s-]+/g, '-');
    		var href = constant.apiurl+constant.admincmslist;
    		var params = {
    			title: formData.cms_title.trim(),
				slug: slug,
				alias_name: formData.cms_alias.trim(),
    			description: formData.cms_desc.trim(),
    			meta_description: formData.cms_meta_desc.trim(),
    			meta_keyword: formData.cms_meta_key.trim(),
    			allow_guest: formData.cms_guest,
    			status:formData.cms_status,
    			user: this.api.decodejwts().userid
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
    	if(this.cmsaddForm.controls['cms_title'].hasError('required') || this.cmsaddForm.controls['cms_desc'].hasError('required') || this.cmsaddForm.controls['cms_slug'].hasError('required') || this.cmsaddForm.controls['cms_meta_desc'].hasError('required') || this.cmsaddForm.controls['cms_meta_key'].hasError('required') || this.cmsaddForm.controls['cms_guest'].hasError('required') || this.cmsaddForm.controls['cms_status'].hasError('required') || this.cmsaddForm.controls['cms_title'].hasError('whitespace') || this.cmsaddForm.controls['cms_desc'].hasError('whitespace') || this.cmsaddForm.controls['cms_slug'].hasError('whitespace') || this.cmsaddForm.controls['cms_meta_desc'].hasError('whitespace') || this.cmsaddForm.controls['cms_meta_key'].hasError('whitespace')) {
    		this.errormessage =  'Fields are required';

            if(this.cmsaddForm.controls['cms_desc'].hasError('required') || this.cmsaddForm.controls['cms_desc'].hasError('whitespace')){
                this.isDescription = true;
            }else{
                this.isDescription = false;
            }
    	}
    }

    showSuccess() {
    	this.is_success = true;
    	setTimeout(() => {
    		this.router.navigate(['/admin/pages']);
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
