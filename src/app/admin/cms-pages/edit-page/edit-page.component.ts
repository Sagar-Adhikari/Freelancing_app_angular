import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup ,Validators, FormControl, DefaultValueAccessor, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api/api.service';
import { constant } from '../../../../data/constant';
import { Title, Meta, DOCUMENT, DomSanitizer } from '@angular/platform-browser';
import { environment } from '.././../../../environments/environment';
import * as Quill from 'quill';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.css']
})
export class EditPageComponent implements OnInit {

  cmseditForm:FormGroup;
	isbuttondisable:boolean = false;
	ismessage:boolean = false;
	is_success:boolean = false;
    isDescription:boolean = false;
	errormessage:string = "";
	data:any;
	gp_data:any;
	result = [];
	gp_result = [];
	selected_group_value:any;
	answer_value:number;
	result_to_form:any;
    html_content:any;
	constructor(public sanitizer:DomSanitizer, public formbuilder:FormBuilder, private api : ApiService, private router:Router, @Inject(DOCUMENT) private document: HTMLDocument,
		private titleService: Title, 
		private route:ActivatedRoute ) {
		this.cmseditForm = formbuilder.group({
			'cms_title' : [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
			'cms_desc' : [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
			'cms_slug' : [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
			'cms_alias' : [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
			'cms_meta_desc' : [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
			'cms_meta_key' : [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
			'cms_guest' : [null, Validators.compose([Validators.required])],
			'cms_status' : [null, Validators.compose([Validators.required])]              
		});
	}

	noWhitespaceValidator(control: FormControl) {
		let isWhitespace = (control.value || '').trim().length === 0;
		let isValid = !isWhitespace;
		return isValid ? null : { 'whitespace': true }
	}

	ngOnInit() {
		this.updatePageInfo();
		this.getEditinfos();
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

    getEditinfos(){
	  	const id = this.route.snapshot.paramMap.get('id');
	    var url = constant.apiurl + constant.admincmslist+id+'/';   
	    this.api.getRequest(url).subscribe(result => {
	    	this.result_to_form = result;
		 },error => {
		    this.errormessage = error.error.non_field_errors["0"];
		    this.showError();
		 },() => {
             this.html_content = this.result_to_form.body.description;
		 	this.cmseditForm.patchValue({
		 	'cms_title' : this.result_to_form.body.title,
			'cms_desc' : this.result_to_form.body.description,
			'cms_slug' : this.result_to_form.body.slug,
			'cms_alias' : this.result_to_form.body.alias_name,
			'cms_meta_desc' : this.result_to_form.body.meta_description,
			'cms_meta_key' : this.result_to_form.body.meta_keyword,
			'cms_guest' : this.result_to_form.body.allow_guest,
			'cms_status' : this.result_to_form.body.status
	      });
		 });
	  }
    
    cmseditFormSubmit(formData) {
    	if(this.cmseditForm.valid) {
    		const id = this.route.snapshot.paramMap.get('id');
    		var slug = formData.cms_slug.toLowerCase().trim();
    		slug = slug.replace(/[^a-z0-9\s-]/g, '');
    		slug = slug.replace(/[\s-]+/g, '-');
    		var href = constant.apiurl+constant.admincmslist+id+'/';
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
    	if(this.cmseditForm.controls['cms_title'].hasError('required') || this.cmseditForm.controls['cms_desc'].hasError('required') || this.cmseditForm.controls['cms_slug'].hasError('required') || this.cmseditForm.controls['cms_meta_desc'].hasError('required') || this.cmseditForm.controls['cms_meta_key'].hasError('required') || this.cmseditForm.controls['cms_guest'].hasError('required') || this.cmseditForm.controls['cms_status'].hasError('required') || this.cmseditForm.controls['cms_title'].hasError('whitespace') || this.cmseditForm.controls['cms_desc'].hasError('whitespace') || this.cmseditForm.controls['cms_slug'].hasError('whitespace') || this.cmseditForm.controls['cms_meta_desc'].hasError('whitespace') || this.cmseditForm.controls['cms_meta_key'].hasError('whitespace')) {
    		this.errormessage =  'Fields are required';
            if(this.cmseditForm.controls['cms_desc'].hasError('required') || this.cmseditForm.controls['cms_desc'].hasError('whitespace')){
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
