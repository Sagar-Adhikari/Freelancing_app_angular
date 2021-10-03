import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';

import { ApiService } from '../../../../services/api/api.service';

@Component({
  selector: 'app-flhourlyrate',
  templateUrl: './flhourlyrate.component.html',
  styleUrls: ['./flhourlyrate.component.css']
})
export class FlhourlyrateComponent implements OnInit {
  jobHourlyEditForm: FormGroup;
  responseData;
  initialRate = 0;
  percentagevalue: any;
  remainingvalue: any;

  // error message
  errorMsg = '';
  errorMsgArr: any = [];
  @ViewChild('ratevalue') rate: any;

  constructor(
    formBulider: FormBuilder,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<FlhourlyrateComponent>,
    public snackBar:MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public getdata: any
  ) {
    this.jobHourlyEditForm = formBulider.group({
      'hourly_rate': [this.getdata.content.hourly_rate, Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {
    this.rate.nativeElement.value = this.initialRate = this.getdata.content.hourly_rate;
    if (this.getdata.content.hourly_rate !== '' && this.getdata.content.hourly_rate != null) {
      this.calculaterate();
    }
  }

  isNumber(evt)
  {
    try{
          var charCode = (evt.which) ? evt.which : evt.keyCode;
    
          if(charCode==46){
              var txt = evt.target.value;
  
              if(!(txt.indexOf(".") > -1)){
                  
                  return true;
              }
          }
          if (charCode > 31 && (charCode < 48 || charCode > 57) )
              return false;
  
          return true;
    }catch(w){
      console.log(w);
    }
  }
  calculaterate() {
    if (this.rate.nativeElement.value > 0 && this.rate.nativeElement.value !== '' && this.rate.nativeElement.value !== null) {
      this.percentagevalue = this.rate.nativeElement.value * 20 / 100;
      this.percentagevalue = this.percentagevalue.toFixed(2);
      this.remainingvalue = this.rate.nativeElement.value - this.percentagevalue;
      this.remainingvalue = this.remainingvalue.toFixed(2);
    } else {
      this.percentagevalue = 0.00;
      this.remainingvalue = 0.00;
    }
  }

  saveJobHourly(formData) {
    if (this.jobHourlyEditForm.valid) {
      if(this.rate.nativeElement.value !== 0 && this.rate.nativeElement.value < 1){
        this.snackBar.open("Please enter 1 or greater than 1");
				setTimeout(() => {
					this.snackBar.dismiss();
				}, 1500);
        return false;
      }
      
      const params = {
        'id': this.getdata.user_id,
        'email': this.getdata.email,
        'profile': {
          'hourly_rate': this.rate.nativeElement.value
        }
      };
      this.apiService.putRequest(this.getdata.api_url + this.getdata.update_url + this.getdata.user_id, params ).subscribe(
          data => {
            this.responseData = data;
            if (this.responseData.body !== '') {
              this.dialogRef.close({'status': 'success',
                'content': {
                  'hourly_rate': this.rate.nativeElement.value
                }
              });
            }
          }, err => {
            console.log(err);
          });
    } else {
      this.errorMsg = 'error';
    }
  }

  onclickcancel() {
    this.dialogRef.close('cancel');
  }

  geterrorMsg(field) {
      return this.jobHourlyEditForm.controls[field].hasError('required') ? 'Field is required' : '';
  }

}
