import { Component, OnInit, HostListener } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms'
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api/api.service';
import { constant } from '../../../../data/constant';
import { MatSnackBar } from '@angular/material';
@Component({
  selector: 'app-postjob',
  templateUrl: './postjob.component.html',
  styleUrls: ['./postjob.component.css']
})
export class PostjobComponent implements OnInit {
  allowReload = false;
  selectedDraftPost: any;
  selectedReusePost: any;
  search: any;
  username: string = this.apiService.decodejwts().userid;
  firstpost:boolean = localStorage.getItem('firstpostck') == 'true' ? true : false;
  checkpost: any;
  categorylists: any;
  selectCategoryForm: FormGroup;
  initialSelectionForm: FormGroup;
  initialsearch: any;
  draftPostLists: any = [];
  getPostListArr: any = [];
  getReuseListArr: any = [];
  reusePostLists: any = [];

  // success/error/disable submit button option
  errormessage: string;
  ismessage = false;
  is_success = false;
  isbuttondisable = false;
  errorMsg = '';
  errorMsgArr;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private router: Router,
    public snackBar: MatSnackBar
  ) {
    this.selectCategoryForm = fb.group({
      'category': ['', Validators.compose([Validators.required])],
      'title': [localStorage.getItem('title') || '', Validators.compose([Validators.required])]
    });
    this.initialSelectionForm = fb.group({
      'readystage': ['1', Validators.compose([Validators.required])],
      'draftPost' : ['', Validators.compose([])],
      'reusePost' : ['', Validators.compose([])]
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.allowReload) {
      localStorage.removeItem('category');
      localStorage.removeItem('title');
      return confirm('Discard changes?');
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(event) {
    localStorage.removeItem('category');
    localStorage.removeItem('title');
    return false;
  }

  ngOnInit() {
    this.checkfirstpost();
    this.getDraftPostList();
    this.getReusePostList();
    this.getCategoryList();
  }

  checkfirstpost() {
    this.apiService.getRequest(constant.apiurl + constant.getalljobdetails + '/?page=1&user=' + this.username)
      .subscribe(responseData => {
        this.checkpost = responseData['body'];
        // if (this.checkpost.count === 0) {
        //   this.firstpost = true;
        // } else {
        //   this.firstpost = false;
        // }
      },
      err => {
        console.log(err);
      });
  }
  draftPostListsfunc(){
    if(this.draftPostLists.length == 0){
      this.snackBar.open("No Draft found.");
				setTimeout(() => {
					this.snackBar.dismiss();
				}, 1500);  
    }
  }

  reusePostListsfunc(){
    if(this.reusePostLists.length == 0){
      this.snackBar.open("No previous job found.");
				setTimeout(() => {
					this.snackBar.dismiss();
				}, 1500);  
    }
  }
  getDraftPostList() {
    this.apiService.getRequest(constant.apiurl + constant.getalljobdetails + '/?page=1&user=' + this.username + '&status=Draft')
      .subscribe(responseData => {
        if (responseData['status'] === 200 && responseData['ok'] === true) {
          this.getPostListArr = responseData['body']['results'];
          if (this.getPostListArr.length > 0) {
            this.getPostListArr.forEach(element => {
              this.draftPostLists.push({ 'id': element.id, 'name': element.name });
            });
          }
        }
      },
      err => {
        console.log(err);
      });
  }

  getReusePostList() {
    this.apiService.getRequest(constant.apiurl + constant.getalljobdetails + '/?page=1&user=' + this.username)
      .subscribe(responseData => {
        if (responseData['status'] === 200 && responseData['ok'] === true) {
          this.getReuseListArr = responseData['body']['results'];
          if (this.getReuseListArr.length > 0) {
            this.getReuseListArr.forEach(element => {
              this.reusePostLists.push({ 'id': element.id, 'name': element.name });
            });
          }
        }
      },
      err => {
        console.log(err);
      });
  }

  getCategoryList() {
    this.apiService.getRequest(constant.apiurl + constant.job_category_all)
      .subscribe(responseData => {
        if (responseData['status'] === 200 && responseData['ok'] === true) {
          this.categorylists = responseData['body'];
        }
      },
      err => {
        console.log(err);
      });
  }

  // Initial category list display & filter option
  // filtercategorylists(search = '') {
  //   if (typeof search === 'object') {
  //     this.initialsearch = search;
  //     search = this.initialsearch.name;
  //   }
  //   this.apiService.getRequest(constant.apiurl + constant.job_category_all + '?search=' + search)
  //     .subscribe(responseData => {
  //       this.categorylists = responseData['body'];
  //     });
  // }
  // display the name of category in the input field
  displayname(category) {
    if (category != null) {
      this.initialsearch = category.name;
      return category.name;
    }
  }

  // category form submission
  categorySubmit(categoryFormData) {
    this.errorMsg = '';
    this.errorMsgArr = [];
    if (this.selectCategoryForm.valid) {
      if (typeof categoryFormData.category !== 'object' || categoryFormData.category.id === 0) {
        // this.errormessage = 'please select valid category';
        this.errorMsg = 'error';
        this.errorMsgArr['category'] = 'Please select valid category';
        // this.showError();
      } else {
        const projectTitle = categoryFormData.title.trim();
        localStorage.setItem('category', categoryFormData.category.id);
        localStorage.setItem('title', projectTitle);
        this.router.navigate(['/newjob']);
      }
    } else {
      this.errorMsg = 'error';
      this.getFormMessage();
      // this.showError();
    }
  }

  initalFormSubmit(initialFormData) {
    const readystage = initialFormData.readystage;
    if (readystage != '') {
      if (readystage == 1) {
        this.firstpost = true;
      } else if (readystage == 2) {
        if (initialFormData.draftPost) {
          this.allowReload = true;
          this.router.navigate(['/editpost/', initialFormData.draftPost]);
        } else {
          this.errormessage = 'Please select draft post from list';
          this.showError();
        }
      } else if (readystage == 3) {
        if (initialFormData.reusePost) {
          this.router.navigate(['/reuse/', initialFormData.reusePost]);
        } else {
          this.errormessage = 'Please select previous job post from list';
          this.showError();
        }
      }
    } else {
      this.errormessage = 'Please select any one the option';
      this.showError();
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
    }, 1000);
  }

  getFormMessage() {
    if (this.selectCategoryForm.controls['category'].hasError('required')
      || this.selectCategoryForm.controls['title'].hasError('noWhitespaceValidator') == false
      || this.selectCategoryForm.controls['title'].hasError('required')) {
      // this.errormessage = 'Fields are required';
    }
  }
  geterrorMsg(field) {
    if (field === 'title') {
      return this.selectCategoryForm.controls['title'].hasError('required') ? 'Field is required' : '';
    } else {
      return this.selectCategoryForm.controls['category'].hasError('required') ? 'Field is required' : '';
    }
  }

  onCancel() {
    this.router.navigate(['/joblisting']);
  }

  onBack() {
    this.firstpost = false;
  }
}
