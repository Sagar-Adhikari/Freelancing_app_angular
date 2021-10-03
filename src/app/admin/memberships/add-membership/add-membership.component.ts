import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup ,Validators, FormControl, DefaultValueAccessor } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from '../../../services/api/api.service';
import { constant } from '../../../../data/constant';
import { Title, Meta, DOCUMENT } from '@angular/platform-browser';
import { environment } from '.././../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-add-membership',
  templateUrl: './add-membership.component.html',
  styleUrls: ['./add-membership.component.css']
})
export class AddMembershipComponent implements OnInit {

  addMembership:FormGroup;
  isbuttondisable:boolean = false;
  ismessage:boolean = false;
  is_success:boolean = false;
  errormessage:string = "";
  successmsg:string = "";
  tag: Observable<any>;
  result:any;
  items:any;
  tag_list = [];
  interval_type_select:any = [
    {"type":"Day","name":"Daily"},
    {"type":"Month","name":"Monthly"},
    // {"type":"quarter","name":"Every 3 months"},
    // {"type":"semiannual","name":"Every 6 months"},
    {"type":"Year","name":"Years"},
    {"type":"custom","name":"Custom"}
  ];

  custom_interval_type_select:any = [
    {"type":"Day","name":"Days"},
    {"type":"Month","name":"Months"}
  ];

  constructor(private sanitizer:DomSanitizer, formbuilder:FormBuilder, private api : ApiService, private router:Router, @Inject(DOCUMENT) private document: HTMLDocument,
      private titleService: Title, 
      private route:ActivatedRoute ) {
    this.addMembership = formbuilder.group({
      'membership_name' : [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'membership_desc' : [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'membership_interval' : [],
      'cm_interval_type' : ['day', Validators.compose([Validators.required])],
      'membership_interval_type' : [null, Validators.compose([Validators.required])],
      'membership_price' : [null, Validators.compose([Validators.required])],
      'allowed_connects' : [null, Validators.compose([Validators.required])]
    });
    this.addMembership.get('membership_interval_type').valueChanges.subscribe(
        (membership_interval_type: string) => {
          if (membership_interval_type === 'custom') {
            this.addMembership.get('membership_interval').setValidators([Validators.compose([Validators.required])]);
            this.addMembership.get('membership_interval').updateValueAndValidity();
          }else{
            this.addMembership.controls['membership_interval'].clearValidators()
            this.addMembership.get('membership_interval').updateValueAndValidity();
          } 
      }
    );

  }

  noWhitespaceValidator(control: FormControl) {
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true }
  }

  ngOnInit() {
    this.updatePageInfo();
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
	  // this.titleService.setTitle( newTitle );
	}

	addMembershipSubmit(formData) {
    // Unique mail validation and data save functionality
    if(this.addMembership.valid) {
      const role_id = this.route.snapshot.paramMap.get('role_id');
      var href      = constant.apiurl+constant.adminmembership;

       var ints = formData.membership_interval_type.trim();
       var periods = 1;
       if (ints != '' && typeof ints != 'undefined' && ints=='custom') {
       		periods = formData.membership_interval;
       		ints = formData.cm_interval_type.trim();
       }

      var params = {
      	membership_name:formData.membership_name.trim(),
      	membership_statement:formData.membership_desc.trim(),
      	membership_periods:periods,
        membership_type:ints,
      	membership_amount:formData.membership_price.trim(),
        membership_connect: formData.allowed_connects.trim()
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

  displaytype(event){
    if(event=='custom'){
      this.document.getElementById('customblock').style.display = "block";
    }else{
      this.document.getElementById('customblock').style.display = "none";
    }
  }

  getFormMessage () {
    if(this.addMembership.controls['membership_name'].hasError('whitespace') || this.addMembership.controls['membership_name'].hasError('required') 
    || this.addMembership.controls['membership_desc'].hasError('whitespace') || this.addMembership.controls['membership_desc'].hasError('required') 
    || this.addMembership.controls['membership_price'].hasError('whitespace') || this.addMembership.controls['membership_price'].hasError('required')
    ) {
      this.errormessage =  'Fields are required';
    }else if(this.addMembership.controls['membership_interval'].hasError('pattern')){
      this.errormessage =  'Membership Days Allows number only';
    }else if(this.addMembership.controls['membership_price'].hasError('pattern')){
      this.errormessage =  'Membership Price Allows number only';
    }else if(this.addMembership.controls['allowed_connects'].hasError('pattern')){
      this.errormessage =  'Membership Connects Allows number only';
    } 
  }

  _keyPress(event: any) {
      const pattern = /[0-9\+\-\ ]/;
      let inputChar = String.fromCharCode(event.charCode);
      if (!pattern.test(inputChar)) {
        event.preventDefault();
      }
  }

  showSuccess() {
    this.is_success = true;
    setTimeout(() => {
        this.router.navigate(['/admin/membership']);
        this.is_success = false;
      }, 1000);
  }

  showError() {
    this.isbuttondisable = true;
    this.ismessage = true;          
    setTimeout(() => {
      this.ismessage = false;
      this.isbuttondisable = false;
    }, 3000);       
  }
}
