import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup ,Validators, FormControl, DefaultValueAccessor, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api/api.service';
import { constant } from '../../../../data/constant';
import { Title, Meta, DOCUMENT, DomSanitizer } from '@angular/platform-browser';
import { environment } from '.././../../../environments/environment';

@Component({
  selector: 'app-edit-testimonials',
  templateUrl: './edit-testimonials.component.html',
  styleUrls: ['./edit-testimonials.component.css']
})
export class EditTestimonialsComponent implements OnInit {

  testmeditForm:FormGroup;
	isbuttondisable:boolean = false;
	ismessage:boolean = false;
	is_success:boolean = false;
	errormessage:string = "";
	data:any;
	gp_data:any;
	result = [];
	gp_result = [];
	selected_group_value:any;
	answer_value:number;
	result_to_form:any;
	constructor(public sanitizer:DomSanitizer, public formbuilder:FormBuilder, private api : ApiService, private router:Router, @Inject(DOCUMENT) private document: HTMLDocument,
		private titleService: Title, 
		private route:ActivatedRoute ) {
		this.testmeditForm = formbuilder.group({
			'testm_author' : [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
			'testm_position' : [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
			'testm_message' : [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
			'testm_video_url' : [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
			'testm_status' : [null, Validators.compose([Validators.required])]              
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
    	var url = constant.apiurl + constant.admintestimonialsurl+id+'/';   
    	this.api.getRequest(url).subscribe(result => {
    		this.result_to_form = result;
    	},error => {
    		this.errormessage = error.error.non_field_errors["0"];
    		this.showError();
    	},() => {
    		this.testmeditForm.patchValue({
    			'testm_author' : this.result_to_form.body.author,
				'testm_position' : this.result_to_form.body.position,
				'testm_message' : this.result_to_form.body.message,
				'testm_video_url' : this.result_to_form.body.video_url,
				'testm_status' : this.result_to_form.body.status
    		});
    	});
    }
    
    testmeditFormSubmit(formData) {
    	if(this.testmeditForm.valid) {
    		const id = this.route.snapshot.paramMap.get('id');
    		var href = constant.apiurl+constant.admintestimonialsurl+id+'/';
    		var params = {
    			author: formData.testm_author.trim(),
    			message: formData.testm_message.trim(),
    			position: formData.testm_position.trim(),
    			video_url: formData.testm_video_url.trim(),
    			status:formData.testm_status
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
    	if(this.testmeditForm.controls['testm_author'].hasError('required') || this.testmeditForm.controls['testm_position'].hasError('required') || this.testmeditForm.controls['testm_message'].hasError('required') || this.testmeditForm.controls['testm_video_url'].hasError('required') || this.testmeditForm.controls['testm_status'].hasError('required') || this.testmeditForm.controls['testm_author'].hasError('whitespace') || this.testmeditForm.controls['testm_position'].hasError('whitespace') || this.testmeditForm.controls['testm_message'].hasError('whitespace') || this.testmeditForm.controls['testm_video_url'].hasError('whitespace')) {
    		this.errormessage =  'Fields are required';
    	}
    }

    showSuccess() {
    	this.is_success = true;
    	setTimeout(() => {
    		this.router.navigate(['/admin/testimonials']);
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
