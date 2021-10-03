import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup ,Validators, FormControl, DefaultValueAccessor } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../services/api/api.service';
import { constant } from '../../../../../data/constant';
import { Title, Meta, DOCUMENT, DomSanitizer } from '@angular/platform-browser';
import { environment } from '../.././../../../environments/environment';

@Component({
  selector: 'app-edit-skills',
  templateUrl: './edit-skills.component.html',
  styleUrls: ['./edit-skills.component.css']
})
export class EditSkillsComponent implements OnInit {

 skillForm:FormGroup;
  isbuttondisable:boolean = false;
  ismessage:boolean = false;
  is_success:boolean = false;
  errormessage:string = "";
  categorylists:any;
  data:any;
  result = [];
  result_to_form:any;
  constructor(public sanitizer:DomSanitizer, formbuilder:FormBuilder, private api : ApiService, private router:Router, @Inject(DOCUMENT) private document: HTMLDocument,
      private titleService: Title, 
      private route:ActivatedRoute ) {
    this.skillForm = formbuilder.group({
      'category_id' : [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'skill_name' : [null, Validators.compose([Validators.required, this.noWhitespaceValidator, Validators.minLength(3)])],
      'skill_status' : [null, Validators.compose([Validators.required])]              
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

  getCategorynames() {
    var href = constant.apiurl+constant.job_category_all;
    var params = '';
    this.api.getRequest(href+'?'+params).subscribe(
    data => {
    	this.data = data;
		this.data.body.forEach(item => { if(item.status=='Active'){ this.result.push(item) } } );
    });
  }

  getEditinfos(){
  	const id = this.route.snapshot.paramMap.get('id');
    var url = constant.apiurl + constant.adminupdateskill+id+'/';   
    this.api.getRequest(url).subscribe(result => {
    	this.result_to_form = result;
	 },error => {
	    this.errormessage = error.error.non_field_errors["0"];
	    this.showError();
	 },() => {
	 	this.skillForm.patchValue({
	 	'category_id': this.result_to_form.body.category,
        'skill_name': this.result_to_form.body.name,
        'skill_status':this.result_to_form.body.status
      });
	 });
  }

  skillFormSubmit(formData) {
  	if(this.skillForm.valid) {
          const id = this.route.snapshot.paramMap.get('id');  
          var href = constant.apiurl+constant.adminupdateskill+id+'/';  
          var params = {
          		  category: formData.category_id,
                  name: formData.skill_name.trim(),
                  status:formData.skill_status
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
  	if(this.skillForm.controls['category_id'].hasError('required') || this.skillForm.controls['skill_name'].hasError('required') || this.skillForm.controls['skill_status'].hasError('required')) {
  		this.errormessage =  'Fields are required';
  	}else if(this.skillForm.controls['skill_name'].hasError('whitespace') || this.skillForm.controls['skill_name'].hasError('minlength')){
  		this.errormessage= 'Skill name must be at least 3 characters long.';
  	}
  }

  showSuccess() {
    this.is_success = true;
    setTimeout(() => {
        this.router.navigate(['/admin/jobs/skills']);
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
