import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { Component, OnInit, Inject } from '@angular/core';
import KhaltiCheckout from 'khalti-web';
import { environment } from '../../../../../environments/environment';
import { ApiService } from '../../../../services/api/api.service';
import { constant } from '../../../../../data/constant';
import { KhaltiVerification } from '../khaltiVerification.model';

@Component({
  selector: 'app-pay-system',
  templateUrl: './pay-system.component.html',
  styleUrls: ['./pay-system.component.css']
})
export class PaySystemComponent implements OnInit {
  amount: any; 
  job_id: any; 
  freelancer_id:any;
  constructor(public apiService: ApiService, private router: Router, private dialogRefbilling: MatDialogRef<PaySystemComponent>, @Inject(MAT_DIALOG_DATA) public getdata: any) {
    this.amount = (typeof (this.getdata.amount) != 'undefined') ? this.getdata.amount : '';
    this.job_id = (typeof (this.getdata.job_id) != 'undefined') ? this.getdata.job_id : '';
    var dt = new Date();
    this.job_id = this.job_id + '~' + dt.getMilliseconds();
    this.freelancer_id = (typeof (this.getdata.freelancer_id) != 'undefined') ? this.getdata.freelancer_id : '';
  }
  

  ngOnInit() {
  }

  esewaPay() {
    var params= {
        amt: this.amount,
        psc: 0,
        pdc: 0,
        txAmt: 0,
        tAmt: this.amount,
        pid: this.job_id,
        scd: "epay_payment",
        su: window.location.href,
        fu: window.location.href
    }

    var form = document.createElement("form");
    form.setAttribute("method", "POST");
    form.setAttribute("action", environment.eSewaPayEndpoint);

    for(var key in params) {
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", params[key]);
        form.appendChild(hiddenField);
    }

    document.body.appendChild(form);
    form.submit();
  }

  onCancel() {
    this.dialogRefbilling.close('cancel');
  }

  khaltiPay() {
    var paymentSuccessful = false;

    var dialogRef = this.dialogRefbilling;
    var apiHelper = this.apiService; 
    var freelancerId = this.freelancer_id;
    console.log('from khalti ');
    console.log(freelancerId);
    let config = {
      publicKey: environment.khaltiPublicKey,
      productIdentity: this.job_id, //todo: generate unique id
      productName: 'Hire',
      productUrl: environment.baseurl,
      eventHandler: {
        onSuccess(payload) {
          localStorage.removeItem('transaction_id');
          localStorage.setItem('transaction_id', payload.token);

          var payloadVerificationData: KhaltiVerification = {
            amount: payload.amount,
            token: payload.token,
            payload_idx: payload.idx,
            mobile: payload.mobile,
            product_identity: payload.product_identity,
            productName: payload.product_name,            
            widget_id: payload.widget_id,  
            client_id:apiHelper.decodejwts().userid,
            freelancer_id: freelancerId,
          };

          console.log('payloadVerificationData:', payloadVerificationData);
          paymentSuccessful = true;

          // hit merchant api for initiating verfication
          console.log('post request is called...');
          apiHelper.postRequest(constant.apiurl + constant.khaltiVerification, payloadVerificationData).subscribe(
          data => {
            console.log(data);
            if (data["is_verified"] == true) { 
              dialogRef.close('success');
            } else {
              dialogRef.close('error');  
            }
            
          }, error => {
            console.log('error verifying Khalti payment.')
            dialogRef.close(error);
            dialogRef.close('error');
          });
        },
        onError(error) {
          // handle errors
          console.log('error with Khalti pay');
          console.log(error);
          dialogRef.close('error');
        },
        onClose() {   
          console.log('on close is called...');
          if(!paymentSuccessful) {
            dialogRef.close('cancel');
          }
        }
      },

    };
    // this.paykhalti(this.khaltiiData);
    let checkout = new KhaltiCheckout(config);
    checkout.show({ amount: (this.amount * 100) }); //Khalti amount is in paisa!
  }
}
