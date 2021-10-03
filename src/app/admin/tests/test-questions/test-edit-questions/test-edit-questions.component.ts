import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup ,Validators, FormControl, DefaultValueAccessor, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../services/api/api.service';
import { constant } from '../../../../../data/constant';
import { Title, Meta, DOCUMENT, DomSanitizer } from '@angular/platform-browser';
import { environment } from './../../../../../environments/environment';

@Component({
  selector: 'app-test-edit-questions',
  templateUrl: './test-edit-questions.component.html',
  styleUrls: ['./test-edit-questions.component.css']
})
export class TestEditQuestionsComponent implements OnInit {
    
    qtneditForm:FormGroup;
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
	results:any;
	aws_list = [];
	constructor(public sanitizer:DomSanitizer, public formbuilder:FormBuilder, private api : ApiService, private router:Router, @Inject(DOCUMENT) private document: HTMLDocument,
		private titleService: Title, 
		private route:ActivatedRoute ) {
		this.qtneditForm = formbuilder.group({
			'category_id' : [null, Validators.compose([Validators.required])],
			'group_id' : [null, Validators.compose([Validators.required])],
			'qtn_name' : [null, Validators.compose([Validators.required, this.noWhitespaceValidator, Validators.minLength(5)])],
			'qtn_answer_block': formbuilder.array([
		        this.initQtnedit()
		        ]),
			'qtn_status' : ['Active', Validators.compose([Validators.required])]              
		});
	}

	initQtnedit() {
		return this.formbuilder.group({
	      'qtn_answer_txt': [null, Validators.compose([Validators.required, this.noWhitespaceValidator, Validators.minLength(3)])]
	  });
	}

	removeQtnedit(index) {
		if (index !== 0) {
			const control = <FormArray>this.qtneditForm.controls['qtn_answer_block'];
			control.removeAt(index);
		} else {
			const control = <FormArray>this.qtneditForm.controls['qtn_answer_block'];
			control.reset();
		}
	}

	saveanswer(value){
		this.answer_value = value;
	}

	public noWhitespaceValidator(control: FormControl) {
		let isWhitespace = (control.value || '').trim().length === 0;
		let isValid = !isWhitespace;
		return isValid ? null : { 'whitespace': true }
	}

	ngOnInit() {
		this.updatePageInfo();
		this.getCategorynames();
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
    	var url = constant.apiurl + constant.admintestqtnlist+id+'/';   
    	this.api.getRequest(url).subscribe(result => {
    		this.results = result;
    	},error => {
    		this.errormessage = error.error.non_field_errors["0"];
    		this.showError();
    	},() => {
    		this.aws_list = this.results.body.answer.split(',');
    		const control = <FormArray>this.qtneditForm.controls['qtn_answer_block'];
    		control;
    		control.removeAt(0);
    		this.aws_list.forEach(item => { control.push(this.formbuilder.group({
		      'qtn_answer_txt': item
		    })); });
			this.answer_value = this.results.body.correct_answer;
			console.log(this.results.body.group_id);
     		this.qtneditForm.patchValue({
    			'category_id': this.results.body.category_id,
    			'group_id': this.results.body.group_id,
    			'qtn_name': this.results.body.question,
    			'qtn_status':this.results.body.status
    		});
    	});
    }

    addQtnedit() {
    	const control = <FormArray>this.qtneditForm.controls['qtn_answer_block'];
    	control.push(this.initQtnedit());
    	console.log(control);
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

    displaygroups(cat_name){
    	this.gp_result = [];
    	this.selected_group_value = undefined;
    	var href = constant.apiurl+constant.admintestgrouplist;
    	var params = 'category='+cat_name;
    	this.api.getRequest(href+'?'+params).subscribe(
    		data => {
    			this.gp_data = data;
    			this.gp_data.body.results.forEach(item => { if(item.status=='Active'){ this.gp_result.push(item) } } );
    		});
    }

    qtneditFormSubmit(formData) {
    	if(this.qtneditForm.valid) {
    		if (typeof this.answer_value == 'undefined') {
	    		this.errormessage= 'Choose one answer';
	    		this.getFormMessage();
    			this.showError();
	    	}else{
                const id = this.route.snapshot.paramMap.get('id');
	    		const answer_sum = formData.qtn_answer_block.map(o => o.qtn_answer_txt).toString();	
	    		// console.log(JSON.stringify(answer_sum));
	    		var href = constant.apiurl+constant.admintestqtnlist+id+'/';
	    		var params = {
	    			category: formData.category_id,
	    			group: formData.group_id.trim(),
	    			question: formData.qtn_name.trim(),
	    			question_type: 1,
	    			correct_answer: this.answer_value,
	    			answer: answer_sum,
	    			status:formData.qtn_status
	    		};
	    		this.api.putRequest(href,params).subscribe(result => {
	    		},error => {
	    			this.errormessage = error.error.non_field_errors["0"];
	    			this.showError();
	    		},() => {
	    			this.showSuccess();   
	    		});
	    	}
    		
    		
    	} else {
    		this.getFormMessage();
    		this.showError();
    	}
    }

    getFormMessage () {
    	if(this.qtneditForm.controls['group_id'].hasError('required') || this.qtneditForm.controls['qtn_name'].hasError('required') || this.qtneditForm.controls['qtn_status'].hasError('required')) {
    		this.errormessage =  'Fields are required';
    	}else if(this.qtneditForm.controls['qtn_name'].hasError('minlength')){
    		this.errormessage= 'Question must be at least 5 characters long.';
    	}
    }

    showSuccess() {
    	this.is_success = true;
    	setTimeout(() => {
    		this.router.navigate(['/admin/test-questions']);
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
