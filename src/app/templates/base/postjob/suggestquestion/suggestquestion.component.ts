import { Component, OnInit, Inject } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { ApiService } from '../../../../services/api/api.service';
import { constant, inputData } from '../../../../../data/constant';

@Component({
  selector: 'app-suggestquestion',
  templateUrl: './suggestquestion.component.html',
  styleUrls: ['./suggestquestion.component.css']
})
export class SuggestquestionComponent implements OnInit {
  suggestedquestions = [];
  getspecificquestions: any;
  apisuggestQuestions: any = [];
  questionsuggeststring: string;
  suggestquestionForm: FormGroup;
  getrecentquestions: any;
  user_id: any;
  savedQAId: any = [];
  selectedQA: any = [];
  makechecked = true;
  getarr = this.getdata.makechecked;
  constructor(
    @Inject(MAT_DIALOG_DATA) public getdata: any,
    private formBuilder: FormBuilder,
    private snackBar:MatSnackBar,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<SuggestquestionComponent>,
  ) {
    this.suggestquestionForm = this.formBuilder.group({
      suggestedquestions: this.formBuilder.array([])
    });
  }

  ngOnInit() {
    this.user_id = this.apiService.decodejwts().userid;
    this.getSuggestedQuestion();
  }

  getSuggestedQuestion() {
    this.apiService.getRequest(constant.apiurl + constant.getsuggestedquestion).subscribe(
      data => {
        this.getspecificquestions = data['body'];
        this.suggestedquestions = this.getspecificquestions;
        // this.suggestedquestions.map((dat,index) =>{
        //     let temp = this.getarr.includes(dat.question)
        //     this.suggestedquestions[index]['checked'] = temp;
        // });
        const formArray = this.suggestquestionForm.get('suggestedquestions') as FormArray;
        this.suggestedquestions.forEach(x => formArray.push(new FormControl(false)));
      });
  }
  onSuggestSave() {
    if (this.suggestquestionForm.value.suggestedquestions.includes(true)) {
          const result = Object.assign({},
            this.suggestquestionForm.value, {
              suggestedquestions: this.suggestedquestions
                .filter((x, i) => !!this.suggestquestionForm.value.suggestedquestions[i])
            });
          let totalLength = result.suggestedquestions.length;
          totalLength--;
          result.suggestedquestions.forEach((element, index) => {
            // save
            const URL = constant.apiurl + constant.jobQuestions;
            var params = {
              'question': element.question,
              'user': this.user_id,
              'type': inputData.defaultQuestionType
            };

            this.apiService.postRequest(URL, params).subscribe(row => {
              this.savedQAId.push(row);
              if (totalLength == index) {
                this.dialogRef.close(this.savedQAId);
              }
            });
          });
      }else{
        this.snackBar.open('Please select a value', '', {
          duration: 2000,
          verticalPosition: 'top'
        });
      }
  }

  onCancelClick(): void {
    this.dialogRef.close("close");
  }
}