import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup ,Validators, FormControl, DefaultValueAccessor } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../services/api/api.service';
import { constant } from '../../../../../data/constant';
import { Title, Meta, DOCUMENT, DomSanitizer } from '@angular/platform-browser';
import { environment } from '../.././../../../environments/environment';

@Component({
  selector: 'app-test-edit-categories',
  templateUrl: './test-edit-categories.component.html',
  styleUrls: ['./test-edit-categories.component.css']
})
export class TestEditCategoriesComponent implements OnInit {
  categoryForm:FormGroup;
  isbuttondisable:boolean = false;
  ismessage:boolean = false;
  is_success:boolean = false;
  errormessage:string = "";
  results:any;
  constructor(public sanitizer:DomSanitizer, formbuilder:FormBuilder, private api : ApiService, private router:Router, @Inject(DOCUMENT) private document: HTMLDocument,
      private titleService: Title, 
      private route:ActivatedRoute ) {
    this.categoryForm = formbuilder.group({
      'category_name' : [null, Validators.compose([Validators.required, this.noWhitespaceValidator, Validators.minLength(3)])],
      'category_status' : [null, Validators.compose([Validators.required, this.noWhitespaceValidator])]              
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
    var url = constant.apiurl + constant.admintestcategorylist+id+'/';   
    this.api.getRequest(url).subscribe(result => {
    	this.results = result;
	 },error => {
	    this.errormessage = error.error.non_field_errors["0"];
	    this.showError();
	 },() => {
	 	this.categoryForm.patchValue({
        'category_name': this.results.body.name,
        'category_status':this.results.body.status
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

  categoryFormSubmit(formData) {
    if(this.categoryForm.valid) {
          const id = this.route.snapshot.paramMap.get('id');  
          var href = constant.apiurl+constant.admintestcategorylist+id+'/';  
          var params = {
                  name: formData.category_name.trim(),
                  status:formData.category_status
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
    if(this.categoryForm.controls['category_name'].hasError('required') || this.categoryForm.controls['category_status'].hasError('required')) {
  		this.errormessage =  'Fields are required';
  	}else if(this.categoryForm.controls['category_name'].hasError('whitespace') || this.categoryForm.controls['category_name'].hasError('minlength')){
  		this.errormessage= 'Category name must be at least 3 characters long.';
  	} 
  }

  showSuccess() {
    this.is_success = true;
    setTimeout(() => {
        this.router.navigate(['/admin/test-categories']);
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