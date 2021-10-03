import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../../../../services/api/api.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatAutocomplete } from '@angular/material';
import { constant } from '../../../../../data/constant';
import { FormBuilder, FormGroup ,Validators, FormControl, DefaultValueAccessor, FormArray } from '@angular/forms';

@Component({
  selector: 'app-contract-category',
  templateUrl: './contract-category.component.html',
  styleUrls: ['./contract-category.component.css']
})
export class ContractCategoryComponent implements OnInit {
  
  contractJobForm: FormGroup;
  data:any;
  job_data:any;
  result = [];
  sub_data:any;
  resfindPropose: any = [];
  sub_result = [];
  job_result = [];
  freelancer_id:any;
  job_id:any;
  job_count = 0;
  freelancer_name:any;
  errorMsg:boolean=false;
  job_category_id:any;
  job_sub_category_id:any;
  job_type:number;
  
  constructor(private apiService: ApiService, @Inject(MAT_DIALOG_DATA) public getdata: any, private fb: FormBuilder,  public dialogChoosebilling: MatDialogRef<ContractCategoryComponent>, private router:Router) {

  	this.contractJobForm = fb.group({
      'job_category': [null, Validators.compose([Validators.required])],     
      'job_sub_category': [null, Validators.compose([Validators.required])],
      'job_type': ['2', Validators.compose([Validators.required])],
      'job':[null],
    });

   }

  ngOnInit() {
  	this.freelancer_id = this.getdata.freelancer_id;
    this.job_id = this.getdata.job_id;
  	this.freelancer_name = this.getdata.freelancer_name;
  	this.getCategorynames();
    this.getJoblist();
  }

  getCategorynames() {
    var href = constant.apiurl+constant.job_category_all;
    var params = '';
    this.apiService.getRequest(href+'?'+params).subscribe(
    data => {
    	this.data = data;
		this.data.body.forEach(item => { if(item.status=='Active'){ this.result.push(item) } } );
    });
  }

  getJoblist(){
    var href = constant.apiurl+constant.joblisting;
    var params = 'user='+this.apiService.decodejwts().userid;
    this.apiService.getRequest(href+'?'+params).subscribe(
      data => {
        this.job_data = data;
        this.job_data.body.forEach(item => { this.job_result.push(item) } );
        this.job_count = this.job_result.length;
        if(this.job_count <= 0){
            this.dialogChoosebilling.close('postjob');
        }
      });
      
  }

  getSubcategorynames(cat_id:any) {
  	this.sub_result.length = 0;
    var href = constant.apiurl+constant.job_category_all;
    var params = 'id='+cat_id;
    this.apiService.getRequest(href+'?'+params).subscribe(
    data => {
    	this.sub_data = data;
    	// console.log(this.sub_data);
		this.sub_data.body["0"].subcategory.forEach(item => { if(item.status=='Active'){ this.sub_result.push(item) } } );
    });

    // console.log(this.sub_result);
  }

  saveHire(post){
  	 this.errorMsg = false;
  	 if (this.contractJobForm.valid) {
  	 	this.job_category_id = post.job_category;
  	 	this.job_sub_category_id = post.job_sub_category;
  	 	this.job_type = post.job_type;
      if(post.job && this.job_id === null){
        this.job_id = post.job;
      }

      // check user already proposed this job
          const check_url = constant.apiurl + constant.job_proposal + '?job=' + this.job_id + '&user=' + this.freelancer_id;
          this.apiService.getRequest(check_url).subscribe(
            row => {
              this.resfindPropose = row;
              console.log(this.resfindPropose);

              if (this.resfindPropose.body.count > 0 && (this.resfindPropose.body.results[0].offer_status != '' || this.resfindPropose.body.results[0].status != '') && this.resfindPropose.body.results[0].offer_status != 'Modified_by_client') {
                alert('Already Proposed for this job');
                this.errorMsg = true;
                this.job_id = '';
              }else{
                  this.dialogChoosebilling.close({
                    'status': 'success',
                    'job_category_id': this.job_category_id,
                    'job_sub_category_id': this.job_sub_category_id,
                    'job_type': this.job_type,
                    'job_id': this.job_id
                 });
              }
            });


  	 	
  	 }else{
  	 	this.errorMsg = true;
  	 }
  }

  geterrorMsg(field) {
  	return this.contractJobForm.controls[field].hasError('required') ? 'Field is required' : '';
  }

  goCanel(){
  	this.dialogChoosebilling.close('cancel');
  	
  }

}
