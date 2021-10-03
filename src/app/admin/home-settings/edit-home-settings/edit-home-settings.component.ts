import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup ,Validators, FormControl, DefaultValueAccessor } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api/api.service';
import { constant } from '../../../../data/constant';
import { Title, Meta, DOCUMENT, DomSanitizer } from '@angular/platform-browser';
import { environment } from '.././../../../environments/environment';

@Component({
  selector: 'app-edit-home-settings',
  templateUrl: './edit-home-settings.component.html',
  styleUrls: ['./edit-home-settings.component.css']
})
export class EditHomeSettingsComponent implements OnInit {

  homeForm:FormGroup;
  isbuttondisable:boolean = false;
  ismessage:boolean = false;
  is_success:boolean = false;
  errormessage:string = "";
  results:any;
  constructor(public sanitizer:DomSanitizer, formbuilder:FormBuilder, private api : ApiService, private router:Router, @Inject(DOCUMENT) private document: HTMLDocument,
      private titleService: Title, 
      private route:ActivatedRoute ) {
    this.homeForm = formbuilder.group({
      'option_value' : [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true }
  }

  ngOnInit() {
    this.updatePageInfo();
    this.getEditinfos();
  }

  getEditinfos(){
  	const id = this.route.snapshot.paramMap.get('id');
    var url = constant.apiurl + constant.adminoptionlist+id+'/';   
    this.api.getRequest(url).subscribe(result => {
    	this.results = result;
	 },error => {
	    this.errormessage = error.error.non_field_errors["0"];
	    this.showError();
	 },() => {
	 	this.homeForm.patchValue({
        'option_value': this.results.body.option_value
      });
	 });
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

  homeFormSubmit(formData) {
    if(this.homeForm.valid) {
          const id = this.route.snapshot.paramMap.get('id');  
          var href = constant.apiurl+constant.adminoptionlist+id+'/';  
          var params = {
                  option_value: formData.option_value.trim()
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
    if(this.homeForm.controls['option_value'].hasError('required') || this.homeForm.controls['home_status'].hasError('required') || this.homeForm.controls['option_value'].hasError('whitespace')) {
  		this.errormessage =  'Fields are required';
  	} 
  }

  showSuccess() {
    this.is_success = true;
    setTimeout(() => {
        this.router.navigate(['/admin/home-settings']);
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
