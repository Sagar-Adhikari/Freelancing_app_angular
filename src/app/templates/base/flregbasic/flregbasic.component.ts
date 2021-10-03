import { Component, OnInit, ViewChild, ComponentFactoryResolver, ViewContainerRef, HostListener } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar, MatDialog, MatDialogRef, MatTooltipModule} from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

import { ApiService } from '../../../services/api/api.service';
import { constant } from '../../../../data/constant';

@Component({
  selector: 'app-flregbasic',
  templateUrl: './flregbasic.component.html',
  styleUrls: ['./flregbasic.component.css']
})
export class FlregbasicComponent implements OnInit {
  flregbasicForm: FormGroup;
  search: any;
  maincategory_id;
  categorylists: any = [];
  initialsearch: any;
  skillscreate: any = [];
  skillsidcreate: any = [];
  disableSkill = false;
  errorMsgMainCategory = false;
  exp_levels = [
    { 'key': 'Entry', 'name': 'Entry Level' },
    { 'key': 'Intermediate', 'name': 'Intermediate' },
    { 'key': 'Expert', 'name': 'Expert' }
  ];
  initialProfileData: any = [];
  initialData: any;
  skillists: any = [];
  responseData: any = [];
  resultSkill: any;
  skillstring: String;
  skillidstring: String;
  // error message
  errorMsg = '';
  errorMsgArr: any;
  userID; userEmail;
  constructor(
    private formBulider: FormBuilder,
    private apiService: ApiService,
    public router: Router
  ) {
    this.flregbasicForm = formBulider.group({
      'main_category': [null],
      'skills': [null, Validators.compose([Validators.required])],
      'experience_level': [null, Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {
    this.userID = this.apiService.decodejwts().userid;
    this.userEmail = this.apiService.decodejwts().email;
    this.getSkills();
    this.getUserProfile();
    this.filtercategorylists('');
  }

  getUserProfile() {
    this.apiService.getRequest(constant.apiurl + constant.get_user_details + this.userID + '/').subscribe(
      data => {
        this.initialData = data;
        if (this.initialData.status === 200) {
          this.initialProfileData = this.initialData.body;
          if (
            this.initialProfileData.profile.category != '' &&
            this.initialProfileData.profile.category != null && this.initialProfileData.profile.category != 'None') {
            this.router.navigate(['/freelancer/more']);
          } else if ( this.initialProfileData.profile.title != '' && this.initialProfileData.profile.title != null && this.initialProfileData.profile.category != '' &&
            this.initialProfileData.profile.category != null && this.initialProfileData.profile.category != 'None') {
            this.router.navigate(['/freelancerprofile']);
          }
        }

      }, err => {
        console.log(err);
    });
  }

  filtercategorylists(search = '') {
    if (typeof search === 'object') {
      this.initialsearch = search;
      search = this.initialsearch.name;
      this.maincategory_id = this.initialsearch.id;
      this.getSkills();
      this.disableSkill = true;
    } else {
      this.disableSkill = false;
    }
    this.apiService.getRequest(constant.apiurl + constant.job_category_all + '?search=' + search)
      .subscribe(responseData => {
        this.categorylists = responseData['body'];
      });
  }
  changeCategory($event){
    if($event.id){
      this.maincategory_id = $event.id;
      // this.flregbasicForm.controls['main_category'].setValue($event.id);
      this.getSkills();
      this.disableSkill = true;
      this.errorMsgMainCategory = false;
    }
  }
  // display the name of category in the input field
  displayname(category) {
    if (category != null) {
      this.initialsearch = category.name;
      return category.name;
    }
  }

  getSkills() {
    this.apiService.getRequest(constant.apiurl + constant.getallskill + '?category=' + this.maincategory_id)
      .subscribe(responseData => {
        this.skillists = responseData['body'];
      });
  }

  basicFlForm(formData) {
    this.errorMsg = '';
    this.errorMsgArr = [];
    if (this.flregbasicForm.valid) {
      if(this.maincategory_id == "" || this.maincategory_id == null || this.maincategory_id == 'undefined'){
        this.errorMsgMainCategory = true;
        this.errorMsg = 'error';
        return false;
      }
      this.errorMsgMainCategory = false;
      const params = {
        'id': this.userID,
        'email': this.userEmail,
        'profile': {
          'category': this.maincategory_id,
          'offer_skill': this.skillstring,
          'category_skill': this.skillidstring,
          'experience_level': formData.experience_level
        }
      };
  
      this.apiService.putRequest(constant.apiurl + constant.updateUserDetails + this.userID + '/', params ).subscribe(
          data => {
            this.responseData = data;
            if (this.responseData.body !== '') {
              this.router.navigate(['/freelancer/more']);
            }
          }, err => {
            console.log(err);
          });
    } else {
      if(this.maincategory_id == "" || this.maincategory_id == null || this.maincategory_id == 'undefined'){
        this.errorMsgMainCategory = true;
      }
      this.errorMsg = 'error';
      
    }
  }

  onDeleteAccount(user_id) {
    // this.apiService.deleteRequest().subscribe({

    // });
  }

  onChangeSkills(event) {
    console.log(event);
    this.skillscreate = [];
    this.skillsidcreate = [];
    event.forEach(element => {
      if (element.id == null) {
        const params = {
          'name': element.name,
          'category': this.maincategory_id,
          'status': 'Active'
      };
        const skillcreateURL = constant.apiurl + constant.skills_creation;
        this.apiService.postRequest(skillcreateURL, params).subscribe(
          row => {
            this.resultSkill = row;
            this.skillscreate.push(this.resultSkill.name);
            this.skillstring = this.skillscreate.toString();
            this.skillsidcreate.push(this.resultSkill.id);
            this.skillidstring = this.skillsidcreate.toString();
          },
        err => {
          console.log(err);
        });
      } else {
        this.skillscreate.push(element.name);
        this.skillstring = this.skillscreate.toString();
        this.skillsidcreate.push(element.id);
        this.skillidstring = this.skillsidcreate.toString();
      }
    });
  }

  geterrorMsg(field) {
    return this.flregbasicForm.controls[field].hasError('required') ? 'Field is required' : '';
  }

}
