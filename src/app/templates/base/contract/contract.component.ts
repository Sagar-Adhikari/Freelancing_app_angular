import { Component, OnInit, HostListener, Output, EventEmitter, ViewChild } from '@angular/core';
import { ApiService } from '../../../services/api/api.service';
import { ActivatedRoute, Router, NavigationEnd, Params } from '@angular/router';
import { constant } from '../../../../data/constant';
import { FormBuilder, FormGroup, Validators, FormControl, DefaultValueAccessor, FormArray } from '@angular/forms';
import * as moment from 'moment';
import { ContractCategoryComponent } from '../contract/contract-category/contract-category.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
// import { BillingMethodComponent } from './../billing-method/billing-method.component';
import { UserService } from '../../../services/sync/user.service';
import { BillingMethodListComponent } from './../billing-method-list/billing-method-list.component';
import { DepositEscrowComponent } from './../contract/deposit-escrow/deposit-escrow.component';
import { Location } from '@angular/common';
import { PaySystemComponent } from '../billing-method/pay-system/pay-system.component';
import { ESewaVerification } from '../billing-method/eSewaVerification.model';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.css']
})
export class ContractComponent implements OnInit {

  freelancer_id: any;
  freelancer_name: any;
  freelancer_email: any;
  freelancer_hourlyrate: any;
  profileDetails: any;
  contractForm: FormGroup;
  isloader = false;
  ismessage: Boolean = false;
  isbuttondisable: Boolean = false;
  errormessage: string;
  result: any;
  // validation message display
  errorMsg = '';
  errorMsgArr: any;
  fixed_terms: boolean = false;
  hourly_terms: boolean = false;
  isDeposited: boolean = false;
  defaultweeklyLimit: any;
  defaultweeklypayment: any;
  transaction_id: any;
  //user avatar
  user_avatar_url = constant.apiurl + constant.user_avatar;

  current_type: number = 2;

  milestone_object = [];
  milestone_display_status: boolean = false;

  today_date: any = moment().format("MM/DD/YYYY");
  myDate: any;
  minDate: any;

  job_category_id: any;
  job_sub_category_id: any;

  total_deposit: any;
  validate_deposit: any;

  //fileupload
  url = [];
  payment_verify: boolean;
  pushFiles = [];
  msgFiles = new FormData();
  file_info_all = [];
  uploadedFile = [];
  uploadinfo: any;
  findPropose = true;
  resfindPropose: any = [];
  defaultDepositType: any = "1";
  defaultManualTime: any = '2';
  contracts_type = [
    { 'key': '1', 'name': 'No limit', 'hrs': '70' },
    { 'key': '2', 'name': '5 hrs/week', 'hrs': '5' },
    { 'key': '3', 'name': '10 hrs/week', 'hrs': '10' },
    { 'key': '4', 'name': '15 hrs/week', 'hrs': '15' },
    { 'key': '5', 'name': '20 hrs/week', 'hrs': '20' },
    { 'key': '6', 'name': '25 hrs/week', 'hrs': '25' },
    { 'key': '7', 'name': '30 hrs/week', 'hrs': '30' },
    { 'key': '8', 'name': '35 hrs/week', 'hrs': '35' },
    { 'key': '9', 'name': '40 hrs/week', 'hrs': '40' },
    { 'key': '10', 'name': '45 hrs/week', 'hrs': '45' },
    { 'key': '10', 'name': '50 hrs/week', 'hrs': '50' },
    { 'key': '10', 'name': '55 hrs/week', 'hrs': '55' },
    { 'key': '10', 'name': '60 hrs/week', 'hrs': '60' },
  ];

  billing_error: boolean = false;
  displayedColumns: string[] = ['brand', 'action'];
  billing_data = [];
  billing_result: any;
  @Output() myEvent = new EventEmitter();
  job_id: any;
  jobData: any;
  esewa_pay_in_process: boolean = false;

  constructor(private apiService: ApiService, private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private DomSan: DomSanitizer,
    private syncVar: UserService,
    public location: Location
  ) {
    this.freelancer_id = this.route.snapshot.paramMap.get('id');
    this.job_id = this.route.snapshot.paramMap.get('job_id');

    // this.route.queryParams.subscribe((params: Params) => {
    //   this.confirmEsewaVerificationIfRequired(params);
    // });

    this.contractForm = fb.group({
      'title': [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'description': [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'terms': [false, Validators.compose([Validators.requiredTrue])],
      'type': [this.current_type],
      'hourly_amount': [''],
      'start_date': [''],
      'weekly_limit': [''],
      'weekly_payment': [],
      'fixed_amount': [],
      'deposit_type': [this.defaultDepositType],
      'due_date': [],
      'milestone_block': fb.array([this.initMilestones()]),
      'manual_time': [this.defaultManualTime]
    });
    if (this.job_id) {
      this.getJobData();
    }
    this.hourly_terms = true;
    this.myDate = new Date();
    this.minDate = new Date(this.myDate.getFullYear(), this.myDate.getMonth(), this.myDate.getDate());

    this.freelancerDetails();

    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        this.router.navigated = false;
        window.scrollTo(0, 0);
      }
    });
  }

  confirmEsewaVerificationIfRequired(params: Params) {
    var refId = params['refId'];
    var apiHelper = this.apiService;
    var post = JSON.parse(localStorage.getItem('pending_post'));
    var that = this;

    if (refId != null && refId != '' && post != null) {
      this.esewa_pay_in_process = true;
      var oid = params['oid'];
      var amt = params['amt'];
      var esewaVerificationModel = new ESewaVerification(amt, oid, refId, this.freelancer_id, this.apiService.decodejwts().userid)
      // hit merchant api for initiating verfication      
      apiHelper.postRequest(constant.apiurl + constant.esewaVerification, esewaVerificationModel).subscribe(
        data => {
          console.log('data["is_verified"]');
          console.log(data["is_verified"]);

          if (data["is_verified"] == true) {
            var urls = JSON.parse(localStorage.getItem('pending_urls'));
            var pushFiles = JSON.parse(localStorage.getItem('pending_pushFiles'));

            post["transaction_id"] = refId;

            if (urls.length > 0) {
              that.pushFiles = pushFiles;
              this.doUploads().then(
                (val) => {
                  this.saveContracts(post);
                }, (err) => { console.error(err); });
            } else {
              this.saveContracts(post);
            }

            this.syncVar.snackMessage('Payment success');
          } else {
            this.syncVar.snackMessage('Error! Payment not verified by server.');
          }

        }, error => {
          console.log(error);
          console.log('error verifying esewa payment.')
          this.syncVar.snackMessage('Error! Payment not verified by server.');
        });
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(event) {
    return false;
  }

  noWhitespaceValidator(control: FormControl) {
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true }
  }


  checkboxValidator(c: FormControl) {
    if (c.get('terms').value == false) {
      return false;
    } else {
      return true;
    }
  }

  ngOnInit() {
    this.defaultManualTime = '2';
    this.getUserdetails();
    const sessionData = sessionStorage.getItem('form_data');
    if (sessionData != null) {
      var parseData = JSON.parse(sessionData);
      this.contractForm.patchValue({
        'title': parseData.title,
        'description': parseData.description,
        'terms': parseData.terms,
        'type': parseData.type,
        'hourly_amount': parseData.hourly_amount,
        'start_date': parseData.start_date,
        'weekly_limit': parseData.weekly_limit,
        'weekly_payment': parseData.weekly_payment,
        'fixed_amount': parseData.fixed_amount,
        'deposit_type': parseData.deposit_type,
        'due_date': parseData.due_date,
        'manual_time': parseData.manual_time
      });
      this.defaultDepositType = parseData.deposit_type;
      this.defaultManualTime = parseData.manual_time;
      if (parseData.milestone_block.length > 0 && parseData.milestone_block[0].milestone_amount > 0) {

        this.milestone_display_status = true;
        const icontrol = <FormArray>this.contractForm.controls['milestone_block'];
        icontrol.removeAt(0);
        parseData.milestone_block.map(item => {
          const control = <FormArray>this.contractForm.controls['milestone_block'];
          control.push(this.setMilestones(item));
        })
      }
    }
    this.formControlValueChanged();
  }

  getUserdetails() {
    this.apiService.getRequest(constant.apiurl + constant.get_user_details + this.apiService.decodejwts().userid + '/').subscribe(
      data => {

        if (data['body'].profile) {
          this.payment_verify = data['body'].profile.has_card
        }
      }, err => {
        console.log(err);
      });
  }

  formControlValueChanged() {

    if (this.current_type == 1) {
      this.contractForm.get('fixed_amount').setValidators([Validators.required]);
      this.contractForm.get('fixed_amount').updateValueAndValidity();

      this.contractForm.get('deposit_type').setValidators([Validators.required]);
      this.contractForm.get('deposit_type').updateValueAndValidity();

      this.contractForm.get('due_date').setValidators([Validators.required]);
      this.contractForm.get('due_date').updateValueAndValidity();

      this.contractForm.get('hourly_amount').clearValidators();
      this.contractForm.get('hourly_amount').updateValueAndValidity();
      this.contractForm.get('start_date').clearValidators();
      this.contractForm.get('start_date').updateValueAndValidity();
      this.contractForm.get('weekly_limit').clearValidators();
      this.contractForm.get('weekly_limit').updateValueAndValidity();
      this.contractForm.get('weekly_payment').clearValidators();
      this.contractForm.get('weekly_payment').updateValueAndValidity();

    } else {

      this.contractForm.controls['fixed_amount'].clearValidators();
      this.contractForm.controls['fixed_amount'].updateValueAndValidity();
      this.contractForm.controls['deposit_type'].clearValidators();
      this.contractForm.controls['deposit_type'].updateValueAndValidity();
      this.contractForm.controls['due_date'].clearValidators();
      this.contractForm.controls['due_date'].updateValueAndValidity();
      this.contractForm.controls['milestone_block'].clearValidators();
      this.contractForm.controls['milestone_block'].updateValueAndValidity();

      this.contractForm.get('hourly_amount').setValidators([Validators.required]);
      this.contractForm.get('hourly_amount').updateValueAndValidity();

      this.contractForm.get('start_date').setValidators([Validators.required]);
      this.contractForm.get('start_date').updateValueAndValidity();

      this.contractForm.get('weekly_limit').setValidators([Validators.required]);
      this.contractForm.get('weekly_limit').updateValueAndValidity();

      this.contractForm.get('weekly_payment').setValidators([Validators.required]);
      this.contractForm.get('weekly_payment').updateValueAndValidity();
    }
  }

  initMilestones() {
    return this.fb.group({
      'milestone_description': [null],
      'milestone_due_date': [null],
      'milestone_amount': [null]
    });
  }
  setMilestones(item: any) {
    return this.fb.group({
      'milestone_description': [item.milestone_description],
      'milestone_due_date': [item.milestone_due_date],
      'milestone_amount': [item.milestone_amount]
    });
  }
  getJobData() {
    const url = constant.apiurl + constant.getindivualjobdetails + '/' + this.job_id + '/';
    this.apiService.getRequest(url).subscribe(
      row => {
        if (row['status'] === 200 && row['ok'] === true) {
          this.jobData = row;
          this.job_category_id = this.jobData.body.category_id;
          this.job_sub_category_id = this.jobData.body.sub_categorie_id;
          if (this.jobData.body.payment == 'Fixed') {
            this.current_type = 1;
            this.fixed_terms = true;
            this.hourly_terms = false;
          } else {
            this.current_type = 2;
            this.fixed_terms = false;
            this.hourly_terms = true;
          }

          this.setFormCategorySessionData();

          this.contractForm.patchValue({
            'title': this.jobData.body.name,
            'description': this.jobData.body.description,
            'type': this.current_type,
            'fixed_amount': this.jobData.body.payment_amount
          });
          this.total_deposit = '$' + this.jobData.body.payment_amount;
          this.validate_deposit = parseFloat(this.jobData.body.payment_amount);
          this.formControlValueChanged();

          // check user already proposed this job
          const check_url = constant.apiurl + constant.job_proposal + '?job=' + this.job_id + '&user=' + this.freelancer_id;
          this.apiService.getRequest(check_url).subscribe(
            row => {
              this.resfindPropose = row;
              console.log(this.resfindPropose);

              if (this.resfindPropose.body.results[0].offer_status != '' && this.resfindPropose.body.results[0].offer_status != 'Modified_by_client') {
                this.findPropose = false;
                setTimeout(() => {
                  this.router.navigate(['freelancerview/' + this.freelancer_id]);
                }, 3000);
              }
            });

        }
      });
  }
  freelancerDetails() {
    this.apiService.getRequest(constant.apiurl + constant.get_user_details + this.freelancer_id).subscribe(
      data => {
        this.profileDetails = data;
        if (this.profileDetails.body != '') {
          this.freelancer_name = this.profileDetails.body.first_name + ' ' + this.profileDetails.body.last_name;
          this.freelancer_email = this.profileDetails.body.email;
          this.freelancer_hourlyrate = this.profileDetails.body.profile.hourly_rate;
          if (this.job_id === null) {
            this.router.navigate(['contract/' + this.freelancer_id + '/' + this.job_id]);
          }
        }
      }, err => {
        console.log(err);
      });
  }

  setFormCategorySessionData() {
    var setSessiondata = {};
    setSessiondata['job_category_id'] = this.job_category_id;
    setSessiondata['job_sub_category_id'] = this.job_sub_category_id;
    setSessiondata['current_type'] = this.current_type;
    setSessiondata['fixed_terms'] = this.fixed_terms;
    setSessiondata['hourly_terms'] = this.hourly_terms;
    setSessiondata['freelancer_id'] = this.freelancer_id;
    setSessiondata['job_id'] = this.job_id;
    setSessiondata['deposit_type'] = this.defaultDepositType;
    setSessiondata['milestone_display_status'] = this.milestone_display_status;
    sessionStorage.setItem('form_category', JSON.stringify(setSessiondata));
  }

  billingPopup() {

    // sessionStorage.setItem('form_data', JSON.stringify(this.contractForm.value));
    // this.setFormCategorySessionData();

    // const dialogChoosebilling = this.dialog.open(BillingMethodComponent, {
    //   disableClose: true,
    //   data: { 'freelancer_id': this.freelancer_id, 'freelancer_name': this.freelancer_name, 'hideclose': true, 'type': 1 }
    // });

    // dialogChoosebilling.afterClosed().subscribe(result => {
    //   if (result !== 'cancel') {
    //     if (result === 'goback') {
    //       this.location.back();
    //       return false;
    //     } else if (this.job_id !== '') {
    //       this.router.navigate(['contract/' + this.freelancer_id + '/' + this.job_id]);
    //     } else {
    //       this.router.navigate(['contract/' + this.freelancer_id]);
    //     }
    //     this.formControlValueChanged();
    //   }
    // });
  }

  contractSubmit(post) {
    this.errorMsg = '';
    this.errorMsgArr = [];
    this.isbuttondisable = true;
    if (this.fixed_terms) {
      let escrowAmount = post.fixed_amount;
      if (post.deposit_type == 2) {
        escrowAmount = post.milestone_block[0].milestone_amount;
        var totalescrow = 0;
        for (var i = 0; i < post.milestone_block.length; i++) {
          if (post.milestone_block[i] === undefined || post.milestone_block[i].milestone_amount == null) continue;
          totalescrow += parseFloat(post.milestone_block[i].milestone_amount);
        }
        if (totalescrow < post.fixed_amount) {
          this.syncVar.snackMessage('Milestone amount is not equal to your total amount');
          this.isbuttondisable = false;
          return false;
        }
      }
      if (post.title == null) {
        this.errorMsg = 'error';
        this.isbuttondisable = false;
        return false;
      }
      if (post.description == null) {
        this.errorMsg = 'error';
        this.isbuttondisable = false;
        return false;
      }
      if (!post.terms) {
        this.errorMsg = 'error';
        this.isbuttondisable = false;
        return false;
      }
      if (post.due_date == null) {
        this.errorMsg = 'error';
        this.isbuttondisable = false;
        return false;
      }
      if (escrowAmount == null) {
        this.syncVar.snackMessage('Please Provide Amount.');
        this.isbuttondisable = false;
        return false;
      }

      var datas = {
        client: this.apiService.decodejwts().userid,
        freelancer: this.freelancer_id,
        job_post: '',
        files: JSON.stringify(this.file_info_all),
        job_category: this.job_category_id,
        job_subcategory: this.job_sub_category_id,
        title: post.title.trim(),
        description: post.description.trim(),
        amount: post.fixed_amount,
        start_date: moment(post.due_date).format("YYYY-MM-DD"),
        chat_message: 'Fixed:$' + post.fixed_amount,
        type: 'Fixed',
        escrow: post.deposit_type,
        milestones: post.deposit_type == 1 ? undefined : this.milestone_object,
        site_url: constant.siteBaseUrl + '/view-offer/',
        job: this.job_id,
        manual_time: post.manual_time === 1 ? true : false,
        transaction_id: "n/a"
      };
      
      if (this.url.length > 0) {
        this.doUploads().then(
          (val) => {
            this.saveContracts(datas);
          }, (err) => { console.error(err); });
      } else {
        this.saveContracts(datas);
      }      
    }
  }

  beginNepPayDialog(post, escrowAmount: number) {
    var datas = {
      client: this.apiService.decodejwts().userid,
      freelancer: this.freelancer_id,
      job_post: '',
      files: JSON.stringify(this.file_info_all),
      job_category: this.job_category_id,
      job_subcategory: this.job_sub_category_id,
      title: post.title.trim(),
      description: post.description.trim(),
      amount: post.fixed_amount,
      start_date: moment(post.due_date).format("YYYY-MM-DD"),
      chat_message: 'Fixed:$' + post.fixed_amount,
      type: 'Fixed',
      escrow: post.deposit_type,
      milestones: post.deposit_type == 1 ? undefined : this.milestone_object,
      site_url: constant.siteBaseUrl + '/view-offer/',
      job: this.job_id,
      manual_time: post.manual_time === 1 ? true : false
    };

    localStorage.removeItem('pending_post');
    localStorage.setItem('pending_post', JSON.stringify(datas));

    localStorage.removeItem('pending_pushFiles');
    localStorage.setItem('pending_pushFiles', JSON.stringify(this.pushFiles));

    localStorage.removeItem('pending_urls');
    localStorage.setItem('pending_urls', JSON.stringify(this.url));

    let billingmethod = this.dialog.open(PaySystemComponent, {
      disableClose: true,
      data: {
        'user_info': this.profileDetails.body,
        'amount': escrowAmount,
        'job_id': this.job_id,
        'freelancer_id': this.freelancer_id,
      }
    });

    billingmethod.afterClosed().subscribe(result => {
      if (result == 'cancel') {
        //user cancelled out of payment
        this.isbuttondisable = false;
      } else if (result == 'success') {
        console.log('save after khalti verification');
        datas["transaction_id"] = localStorage.getItem('transaction_id');

        console.log(datas);
        if (this.url.length > 0) {
          this.doUploads().then(
            (val) => {
              this.saveContracts(datas);
            }, (err) => { console.error(err); });
        } else {
          this.saveContracts(datas);
        }
        this.syncVar.snackMessage('Payment success');
      } else {
        //error
        this.isbuttondisable = false;
        this.syncVar.snackMessage('Error. Payment failed!');
      }
    });
  }

  beforeSubmitContract(post) {
    this.errorMsg = '';
    this.errorMsgArr = [];
    this.formControlValueChanged();
    if (this.contractForm.valid && this.isDeposited) {
      var datas;
      if (this.current_type == 1) {
        if (post.deposit_type == 2) {

          var msg = 'Fixed:$' + post.fixed_amount;

          const answer_sum = post.milestone_block.map(item => {
            var de = moment(item.milestone_due_date).format("YYYY-MM-DD");
            return { 'name': item.milestone_description, 'due_date': de, 'deposit_amount': item.milestone_amount };
          }).forEach(item => {
            this.milestone_object.push(item);
          });
          datas = {
            client: this.apiService.decodejwts().userid,
            freelancer: this.freelancer_id,
            job_post: '',
            files: JSON.stringify(this.file_info_all),
            job_category: this.job_category_id,
            job_subcategory: this.job_sub_category_id,
            title: post.title.trim(),
            description: post.description.trim(),
            amount: post.fixed_amount,
            start_date: moment(post.due_date).format("YYYY-MM-DD"),
            chat_message: msg,
            type: 'Fixed',
            escrow: post.deposit_type,
            milestones: this.milestone_object,
            site_url: constant.siteBaseUrl + '/view-offer/',
            job: this.job_id,
            transaction_id: this.transaction_id,
            manual_time: post.manual_time === 1 ? true : false
          };
        } else {
          datas = {
            client: this.apiService.decodejwts().userid,
            freelancer: this.freelancer_id,
            job_post: '',
            files: JSON.stringify(this.file_info_all),
            job_category: this.job_category_id,
            job_subcategory: this.job_sub_category_id,
            title: post.title.trim(),
            description: post.description.trim(),
            amount: post.fixed_amount,
            start_date: moment(post.due_date).format("YYYY-MM-DD"),
            chat_message: msg,
            type: 'Fixed',
            escrow: post.deposit_type,
            site_url: constant.siteBaseUrl + '/view-offer/',
            job: this.job_id,
            transaction_id: this.transaction_id,
            manual_time: post.manual_time === 1 ? true : false
          };
        }

      } else {
        var msg = 'Limit:' + this.contracts_type[post.weekly_limit - 1].name;
        datas = {
          client: this.apiService.decodejwts().userid,
          freelancer: this.freelancer_id,
          job_post: '',
          files: JSON.stringify(this.file_info_all),
          job_category: this.job_category_id,
          job_subcategory: this.job_sub_category_id,
          title: post.title.trim(),
          description: post.description.trim(),
          amount: post.hourly_amount,
          limit: post.weekly_limit,
          start_date: moment(post.start_date).format("YYYY-MM-DD"),
          weekly_payment: post.weekly_payment,
          chat_message: msg,
          type: 'Hourly',
          site_url: constant.siteBaseUrl + '/view-offer/',
          job: this.job_id,
          manual_time: post.manual_time === 1 ? true : false
        };
      }

      if (this.url.length > 0) {
        this.doUploads().then(
          (val) => {
            datas['files'] = JSON.stringify(this.file_info_all);
            this.saveContracts(datas);
          }, (err) => { console.error(err); });
      } else {
        this.saveContracts(datas);
      }
    } else {
      this.isbuttondisable = false;
      sessionStorage.setItem('form_data', JSON.stringify(post));
      this.setFormCategorySessionData();
      this.showError();
    }

  }

  saveContracts(datas: any) {
    console.log('save contracts');
    console.log(datas);
    this.apiService.postRequest(constant.apiurl + constant.savecontracts, datas).subscribe(
      data => {
        this.result = data;
        this.syncVar.snackMessage('Offer has been sent successfully.');
        this.router.navigate(['joblisting']);
      }, error => {
        console.log('error savig contract...');
        console.log(error);
        if (error) {
          this.errorMsg = 'error';
          // this.ismessage = true;
          this.isloader = false;
          this.isbuttondisable = true;
          setTimeout(() => {
            // this.ismessage = false;
            this.isbuttondisable = false;
          }, 2000);

        }
      });
  }

  showError() {
    this.errorMsg = 'error';
    this.isbuttondisable = true;
    this.ismessage = true;
    setTimeout(() => {
      this.ismessage = false;
      this.isbuttondisable = false;
    }, 2000);
  }

  geterrorMsg(field) {
    if (field != 'due_date' && field != 'terms') {
      return (this.contractForm.controls[field].hasError('required') || this.contractForm.controls[field].hasError('whitespace')) ? 'Field is required' : '';
    } else {
      return this.contractForm.controls[field].hasError('required') ? 'Field is required' : '';
    }
  }

  _keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  changeType(type: number) {
    this.errorMsg = '';
    if (type == 1) {
      this.current_type = 1; // fixed
      this.fixed_terms = true;
      this.hourly_terms = false;
    } else if (type == 2) {
      this.current_type = 2; // hourly
      this.hourly_terms = true;
      this.fixed_terms = false;
    }
  }

  addMile() {
    const control = <FormArray>this.contractForm.controls['milestone_block'];
    control.push(this.initMilestones());
  }

  removeMile(index) {
    if (index !== 0) {
      const control = <FormArray>this.contractForm.controls['milestone_block'];
      control.removeAt(index);
    } else {
      const control = <FormArray>this.contractForm.controls['milestone_block'];
      control.reset();
    }
  }

  changeCrowType(event) {
    if (event.value == 1) {
      this.milestone_display_status = false;
    } else {
      this.milestone_display_status = true;
    }
  }

  onCancel() {
    if (this.job_id) {
      this.router.navigate(['freelancerview/' + this.freelancer_id]);
    } else {
      window.history.back();
    }

  }

  onKeyUp(event) {
    if (this.milestone_display_status == false) {
      this.total_deposit = '$' + event.srcElement.value;
    } else {
      this.total_deposit = '';
    }
  }
  tempimg = [];
  readUrl(event: any) {
    // this.url = [];
    // this.url.length = 0;
    if (event.target.files.length > 0) {
      // this.tempimg.length = 0;
      // this.tempimg = [];
      for (var i = event.target.files.length - 1; i >= 0; i--) {
        // this.msgFiles = new FormData();
        var file_ext = event.target.files[i].name.split('.').pop();
        var file_type = event.target.files[i].type;
        var file_size = event.target.files[i].size;
        var file_name = event.target.files[i].name;

        var img_type = ['image/gif', 'image/jpeg', 'image/png', 'image/jpg'];
        var excel = ['application/vnd.ms-excel', 'application/vnd.ms-powerpoint', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        var adobe = ['application/pdf'];
        var zipFiles = ['application/zip'];
        var jsFiles = ['text/javascript'];
        var sqlFiles = ['application/sql'];
        var csvFiles = ['text/csv', 'application/vnd.ms-excel'];
        var exeFiles = ['application/x-ms-dos-executable'];

        // console.log(file_size)

        if (img_type.indexOf(file_type) > -1) {
          var reader = new FileReader();
          reader.readAsDataURL(event.target.files[i]);
          reader.onload = (event) => {
            this.tempimg.push(event.target['result']);
          }

          const u = (window.URL) ? window.URL.createObjectURL(event.target.files[i]) : (window as any).webkitURL.createObjectURL(event.target.files[i]);
          this.url.push({ 'img': this.tempimg, 'size': event.target.files[i].size, 'file_name': event.target.files[i].name, 'file_type': 'img' });
          this.pushFiles.push(event.target.files[i]);
          // console.log(this.tempimg)
        } else if (excel.indexOf(file_type) > -1) {
          this.url.push({ 'img': [constant.siteBaseUrl + '/assets/images/thumbimg/docthumb.png'], 'size': event.target.files[i].size, 'file_name': event.target.files[i].name, 'file_type': 'other' });
          this.pushFiles.push(event.target.files[i]);
        } else if (adobe.indexOf(file_type) > -1) {
          this.url.push({ 'img': [constant.siteBaseUrl + '/assets/images/thumbimg/pdfthumb.png'], 'size': event.target.files[i].size, 'file_name': event.target.files[i].name, 'file_type': 'other' });
          this.pushFiles.push(event.target.files[i]);
        } else if (zipFiles.indexOf(file_type) > -1) {
          this.url.push({ 'img': [constant.siteBaseUrl + '/assets/images/thumbimg/zipthumb.png'], 'size': event.target.files[i].size, 'file_name': event.target.files[i].name, 'file_type': 'other' });
          this.pushFiles.push(event.target.files[i]);
        } else if (jsFiles.indexOf(file_type) > -1) {
          this.url.push({ 'img': [constant.siteBaseUrl + '/assets/images/thumbimg/jsthumb.png'], 'size': event.target.files[i].size, 'file_name': event.target.files[i].name, 'file_type': 'other' });
          this.pushFiles.push(event.target.files[i]);
        } else if (sqlFiles.indexOf(file_type) > -1) {
          this.url.push({ 'img': [constant.siteBaseUrl + '/assets/images/thumbimg/sqlthumb.png'], 'size': event.target.files[i].size, 'file_name': event.target.files[i].name, 'file_type': 'other' });
          this.pushFiles.push(event.target.files[i]);
        } else if (csvFiles.indexOf(file_type) > -1) {
          this.url.push({ 'img': [constant.siteBaseUrl + '/assets/images/thumbimg/csvthumb.png'], 'size': event.target.files[i].size, 'file_name': event.target.files[i].name, 'file_type': 'other' });
          this.pushFiles.push(event.target.files[i]);
        } else if (exeFiles.indexOf(file_type) > -1) {
          this.syncVar.snackMessage("Sorry exe files could not be added to list.");
        } else {
          this.url.push({ 'img': [constant.siteBaseUrl + '/assets/images/thumbimg/nonethumb.png'], 'size': event.target.files[i].size, 'file_name': event.target.files[i].name, 'file_type': 'other' });
          this.pushFiles.push(event.target.files[i]);
        }
      }
    }
  }

  doUploads() {
    const rm = this.pushFiles.length - 1;
    var promise = new Promise((resolve, reject) => {
      if (this.url.length > 0) {
        const msgFiles = new FormData();
        for (var i = 0; i < this.pushFiles.length; i++) {
          this.msgFiles.append('file', this.pushFiles[i]);
          this.msgFiles.append('user', this.apiService.decodejwts().userid);
          this.msgFiles.append('type', 'Contract');
          this.msgFiles.append('file_name', this.pushFiles[i].name);
          this.msgFiles.append('file_ext', this.pushFiles[i].type);
          this.msgFiles.append('file_size', this.pushFiles[i].size);

          this.apiService.uploadFile(constant.apiurl + constant.fileupload, this.msgFiles).subscribe(
            data => {
              this.uploadinfo = data;
              this.file_info_all.push(this.uploadinfo);
              this.uploadedFile.push(this.uploadinfo.id);
            },
            err => {
              console.log('something went wrong');
            }
          );
          setTimeout(() => {
            resolve();
          }, 800);
        }
      }
    });

    return promise;
  }

  removefiles(id) {
    this.url[id].img.splice(id, 1)
    this.url.splice(id, 1);
    this.pushFiles.splice(id, 1);
  }

}
