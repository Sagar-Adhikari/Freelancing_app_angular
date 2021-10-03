import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup ,Validators, FormControl, DefaultValueAccessor } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../services/api/api.service';
import { constant } from '../../../../../data/constant';
import { Title, Meta, DOCUMENT, DomSanitizer } from '@angular/platform-browser';
import { environment } from '../.././../../../environments/environment';

@Component({
  selector: 'app-add-sub-category',
  templateUrl: './add-sub-category.component.html',
  styleUrls: ['./add-sub-category.component.css']
})
export class AddSubCategoryComponent implements OnInit {
subcategoryForm:FormGroup;
  isbuttondisable:boolean = false;
  ismessage:boolean = false;
  is_success:boolean = false;
  errormessage:string = "";
  categorylists:any;
  data:any;
  result = [];
  constructor(public sanitizer:DomSanitizer, formbuilder:FormBuilder, private api : ApiService, private router:Router, @Inject(DOCUMENT) private document: HTMLDocument,
      private titleService: Title, 
      private route:ActivatedRoute ) {
    this.subcategoryForm = formbuilder.group({
      'category_id' : [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'category_name' : [null, Validators.compose([Validators.required, this.noWhitespaceValidator, Validators.minLength(3)])],
      'category_status' : ['Active', Validators.compose([Validators.required])]              
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
    var href = constant.apiurl+constant.job_category_all;
    var params = '';
    this.api.getRequest(href+'?'+params).subscribe(
    data => {
    	this.data = data;
		this.data.body.forEach(item => { if(item.status=='Active'){ this.result.push(item) } } );
    });
  }

  subcategoryFormSubmit(formData) {
    if(this.subcategoryForm.valid) {
          var href = constant.apiurl+constant.adminsubcategorylist;
          var params = {
          		  category: formData.category_id,
                  name: formData.category_name.trim(),
                  status:formData.category_status
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
  	if(this.subcategoryForm.controls['category_id'].hasError('required') || this.subcategoryForm.controls['category_name'].hasError('required') || this.subcategoryForm.controls['category_status'].hasError('required')) {
  		this.errormessage =  'Fields are required';
  	}else if(this.subcategoryForm.controls['category_name'].hasError('whitespace') || this.subcategoryForm.controls['category_name'].hasError('minlength')){
  		this.errormessage= 'Subcategory name must be at least 3 characters long.';
  	}
  }

  showSuccess() {
    this.is_success = true;
    setTimeout(() => {
        this.router.navigate(['/admin/jobs/sub-categorys']);
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
