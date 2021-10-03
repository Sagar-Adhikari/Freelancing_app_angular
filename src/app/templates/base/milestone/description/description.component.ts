import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { ApiService } from '../../../../services/api/api.service';
import { constant } from '../../../../../data/constant';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.css']
})
export class DescriptionComponent implements OnInit {
  setDescForm: FormGroup;

  constructor(
    public apiService: ApiService,
    public dialogRef: MatDialogRef<DescriptionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
  ) {
    this.setDescForm = fb.group({
      'description' : [null],
    });
  }

  ngOnInit() {
  }

  onCancelClick(): void {
    this.dialogRef.close('close');
  }

  OnSubmitDescript(formData) {
    this.apiService.putRequest(this.data.from ? constant.apiurl + constant.payment_request_update : constant.apiurl + constant.contract_milestane_request , { 'description': formData.description, 'id': this.data.milestone_id, 'contract_id' : this.data.contract_id, 'has_milestone' : this.data.has_milestone }).subscribe(
      data => {
        this.dialogRef.close(data);
      }, error => {
        console.log(error);
        this.dialogRef.close('error');
      });
  }

}
