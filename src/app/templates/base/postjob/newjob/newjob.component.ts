import { Component, OnInit, HostListener } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatExpansionModule} from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../../../../services/api/api.service';
import { constant } from '../../../../../data/constant';

@Component({
  selector: 'app-newjob',
  templateUrl: './newjob.component.html',
  styleUrls: ['./newjob.component.css']
})
export class NewjobComponent implements OnInit {
  panelOpenState = false;
  subcategorylist: any;
  subcategoryForm: FormGroup;
  selectedSubcategory: any;
  allCategory: any;
  assubcategorylist: any;
  selectedSecCategory: any;
  selectedAsSubCategory: any;
  subcategoryshow:boolean;
  // success/error/disable submit button option
  errormessage: string;
  ismessage = false;
  is_success = false;
  isbuttondisable = true;

  errorMsg = '';
  errorMsgArr: any = [];

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.subcategoryForm = fb.group({
      'subcategory': [null, Validators.compose([])],
      'sec_category': [null, Validators.compose([])],
      'sec_subcategory': [null, Validators.compose([])]
    });
  }

  canDeactivate(): Observable<boolean> | boolean {
    localStorage.removeItem('category');
    localStorage.removeItem('title');
    return confirm('Discard changes?');
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(event) {
    // localStorage.removeItem('category');
    // localStorage.removeItem('title');
    return false;
  }

  @HostListener('window:unload', ['$event'])
  unloadHandler(event) {
    localStorage.removeItem('category');
    localStorage.removeItem('title');
    return false;
  }

  ngOnInit() {
    if (!localStorage.getItem('category')) {
      this.router.navigate(['/postjob']);
    }
    this.getSubCategory();
    this.getAllCategory();
  }
  categoryformshowfunc(){
    if(this.panelOpenState){
      this.panelOpenState = false;
    }else{
      this.panelOpenState = true;
    }
  }
  // Get SUbcategory based previous main category selection
  getSubCategory() {
    this.apiService.getRequest(constant.apiurl + constant.job_subcategory_all + '?category=' + localStorage.getItem('category'))
      .subscribe(responseData => {
        this.subcategorylist = responseData['body'];
        if(this.subcategorylist.length < 1){
          this.subcategoryshow = false;
          this.panelOpenState = true;

        }else{
          this.subcategoryshow = true;
          this.panelOpenState = false;
        }
      });
  }
  // Get All Category List
  getAllCategory() {
    this.apiService.getRequest(constant.apiurl + constant.job_category_all + '?search=')
      .subscribe(responseData => {
        this.allCategory = responseData['body'];
      });
  }
   // Onchange the maincategory list based to display subcategory
   onchangeallcategory(category) {
    this.isbuttondisable = false;
    this.selectedSubcategory = null;
    this.apiService.getRequest(constant.apiurl + constant.job_subcategory_all + '?category=' + category)
      .subscribe(responseData => {
        this.assubcategorylist = responseData['body'];
      });
  }
  // Onchange subcategory selection enabled submit button
  onchangesubcategory(subcategory) {
    this.selectedSecCategory = null;
    this.selectedAsSubCategory = null;
    this.isbuttondisable = false;
    this.errorMsgArr['sec_category'] = '';
  }
  // Onchange secsubcategory reset subcategory option
  onchangesecsubcategory(secsubcategory) {
    this.selectedSubcategory = null;
    this.errorMsgArr['sec_subcategory'] = '';
  }
  // form submission
  subcategoryFormSubmit(formData) {
    this.errorMsg = '';
    this.errorMsgArr = [];
    if (formData.subcategory == null) {
      if (formData.sec_category == null) {
        this.errorMsg = 'error';
        this.errormessage = 'Fields are required';
        this.errorMsgArr['sec_category'] = 'Fields are required';
        // this.showError();
      } else if (formData.sec_subcategory == null) {
        this.errorMsg = 'error';
        this.errormessage = 'Fields are required';
        this.errorMsgArr['sec_subcategory'] = 'Fields are required';
        // this.showError();
      } else {
        // find category name
        localStorage.setItem('category', formData.sec_category);
        var indivualcategory = this.allCategory.find(row => row.id === formData.sec_category);
        localStorage.setItem('category_name', indivualcategory.name);
        // find subcategory name
        localStorage.setItem('subcategory', formData.sec_subcategory);
        var indivualsubcategory = this.assubcategorylist.find(row => row.id === formData.sec_subcategory);
        localStorage.setItem('subcategory_name', indivualsubcategory.sub_cat_name);
        this.router.navigate(['/new/post']); // redirect to main form
      }
    } else {
      var indivualcategory = this.allCategory.find(row => row.id === localStorage.getItem('category'));
      localStorage.setItem('category_name', indivualcategory.name);
      localStorage.setItem('subcategory', formData.subcategory);
      var indivualsubcategory = this.subcategorylist.find(row => row.id === formData.subcategory);
      localStorage.setItem('subcategory_name', indivualsubcategory.sub_cat_name);
      this.router.navigate(['/new/post']); // redirect to main form
    }
  }

  showSuccess() {
    this.is_success = true;
    setTimeout(() => {
      this.is_success = false;
    }, 2000);
  }

  showError() {
    this.isbuttondisable = true;
    this.ismessage = true;
    setTimeout(() => {
      this.ismessage = false;
      this.isbuttondisable = false;
    }, 2000);
  }

  gotoback() {
    localStorage.removeItem('category');
    localStorage.removeItem('title');
    localStorage.setItem('firstpostck','true');
    this.router.navigate(['/postjob']);
  }
}
