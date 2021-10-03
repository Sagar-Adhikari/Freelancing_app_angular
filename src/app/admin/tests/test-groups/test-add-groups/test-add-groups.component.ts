import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup ,Validators, FormControl, DefaultValueAccessor } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../services/api/api.service';
import { constant } from '../../../../../data/constant';
import { Title, Meta, DOCUMENT, DomSanitizer } from '@angular/platform-browser';
import { environment } from '../.././../../../environments/environment';

@Component({
	selector: 'app-test-add-groups',
	templateUrl: './test-add-groups.component.html',
	styleUrls: ['./test-add-groups.component.css']
})
export class TestAddGroupsComponent implements OnInit {

	groupForm:FormGroup;
	isbuttondisable:boolean = false;
	ismessage:boolean = false;
	is_success:boolean = false;
	errormessage:string = "";
	data:any;
	result = [];
	constructor(public sanitizer:DomSanitizer, formbuilder:FormBuilder, private api : ApiService, private router:Router, @Inject(DOCUMENT) private document: HTMLDocument,
		private titleService: Title, 
		private route:ActivatedRoute ) {
		this.groupForm = formbuilder.group({
			'category_id' : [null, Validators.compose([Validators.required])],
			'group_name' : [null, Validators.compose([Validators.required, this.noWhitespaceValidator, Validators.minLength(3)])],
			'group_desc' : [null, Validators.compose([Validators.required, this.noWhitespaceValidator, Validators.minLength(10)])],
			'group_status' : ['Active', Validators.compose([Validators.required])]              
		});
	}

	public noWhitespaceValidator(control: FormControl) {
		let isWhitespace = (control.value || '').trim().length === 0;
		let isValid = !isWhitespace;
		return isValid ? null : { 'whitespace': true }
	}

	ngOnInit() {
		this.updatePageInfo();
		this.getCategorynames();
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

    getCategorynames() {
    	var href = constant.apiurl+constant.admintestcategorylist;
    	var params = '';
    	this.api.getRequest(href+'?'+params).subscribe(
    		data => {
    			this.data = data;
    			this.data.body.results.forEach(item => { if(item.status=='Active'){ this.result.push(item) } } );

    		});
    }

    groupFormSubmit(formData) {
    	if(this.groupForm.valid) {
    		var href = constant.apiurl+constant.admintestgrouplist;
    		var params = {
    			category: formData.category_id,
    			title: formData.group_name.trim(),
    			description: formData.group_desc.trim(),
    			status:formData.group_status
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
    	if(this.groupForm.controls['group_name'].hasError('required') || this.groupForm.controls['group_desc'].hasError('required') || this.groupForm.controls['group_status'].hasError('required')) {
    		this.errormessage =  'Fields are required';
    	}else if(this.groupForm.controls['group_name'].hasError('whitespace') || this.groupForm.controls['group_name'].hasError('minlength')){
    		this.errormessage= 'Group name must be at least 3 characters long.';
    	}else if(this.groupForm.controls['group_desc'].hasError('whitespace') || this.groupForm.controls['group_desc'].hasError('minlength')){
    		this.errormessage= 'Group description must be at least 10 characters long.';
    	}
    }

    showSuccess() {
    	this.is_success = true;
    	setTimeout(() => {
    		this.router.navigate(['/admin/test-groups']);
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
