import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, DefaultValueAccessor } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../services/api/api.service';
import { constant } from '../../../../../data/constant';
import { Title, Meta, DOCUMENT, DomSanitizer } from '@angular/platform-browser';
import { environment } from '../.././../../../environments/environment';

@Component({
  selector: 'app-add-suggested-question',
  templateUrl: './add-suggested-question.component.html',
  styleUrls: ['./add-suggested-question.component.css']
})
export class AddSuggestedQuestionComponent implements OnInit {

  sugqtnForm: FormGroup;
  isbuttondisable: boolean = false;
  ismessage: boolean = false;
  is_success: boolean = false;
  errormessage: string = "";
  queryUserID = this.api.decodejwts().userid; // logged user id
  constructor(public sanitizer: DomSanitizer, formbuilder: FormBuilder, private api: ApiService, private router: Router, @Inject(DOCUMENT) private document: HTMLDocument,
    private titleService: Title,
    private route: ActivatedRoute) {
    this.sugqtnForm = formbuilder.group({
      'sug_qtn_name': [null, Validators.compose([Validators.required, this.noWhitespaceValidator, Validators.minLength(3)])]
    });
  }

  noWhitespaceValidator(control: FormControl) {
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true }
  }

  ngOnInit() {
  }
  sugqtnFormSubmit(formData) {
    if (this.sugqtnForm.valid) {
      var href = constant.apiurl + constant.suggestedquestions;
      var params = {
        question: formData.sug_qtn_name.trim(),
        user: this.queryUserID
      };
      this.api.postRequest(href, params).subscribe(result => {
      }, error => {
        this.errormessage = error.error.non_field_errors["0"];
        this.showError();
      }, () => {
        this.showSuccess();
      });
    } else {
      this.getFormMessage();
      this.showError();
    }
  }

  getFormMessage() {
    if (this.sugqtnForm.controls['sug_qtn_name'].hasError('required')) {
      this.errormessage = 'Fields are required';
    } else if (this.sugqtnForm.controls['sug_qtn_name'].hasError('whitespace') || this.sugqtnForm.controls['sug_qtn_name'].hasError('minlength')) {
      this.errormessage = 'Question must be at least 3 characters long.';
    }
  }

  showSuccess() {
    this.is_success = true;
    setTimeout(() => {
      this.router.navigate(['/admin/jobs/suggested/question']);
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
