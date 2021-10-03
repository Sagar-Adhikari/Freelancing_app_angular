import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatPaginator, MatTableDataSource, PageEvent, MatDialog } from '@angular/material';

import { ApiService } from '../../../services/api/api.service';
import { constant } from '../../../../data/constant';
import { CommonAlertComponent } from './../common-alert/common-alert.component';
import { duration } from 'moment';
import { timer } from 'rxjs';

@Component({
  selector: 'app-htmltestquestions',
  templateUrl: './htmltestquestions.component.html',
  styleUrls: ['./htmltestquestions.component.css']
})
export class HtmltestquestionsComponent implements OnInit, OnDestroy {
  userID = this.apiService.decodejwts().userid; // logged user id
  group_id: any;
  questionId: any;
  resQuestionDetails: any = [];
  resQuestionAnswer: any = [];
  errorResQusAns: any = [];
  testQuestionCount: any;
  nextPage: any = 1;
  testQuestionDetails = new MatTableDataSource(this.testQuestionDetails);
  continueDisable = true;
  timerview;
  /** Question & Answer table creation */
  displayedQuesTestColumns: string[] = ['questions'];
  header: string = localStorage.getItem('hdr');
  timeLeft = 60;
  interval;
  subscribeTimer: any;
  changeTxtSubmit = false;
  constructor(
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.group_id = params['groupid'];
    });
    this.getTestQuestionAnsDetails();
  }

  
  oberserableTimer() {
    const source = timer(1000, 2000);
    const abc = source.subscribe(val => {
      console.log(val, '-');
      this.subscribeTimer = this.timeLeft - val;
    });
  }
  startTimer1(page,totalcount) {
    let pages = page;
    this.pauseTimer();
    this.interval = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft >= 0) {
        if (this.timeLeft == 0) {
          this.pauseTimer();
          if(parseInt(totalcount) == parseInt(pages)){
            sessionStorage.removeItem('setpage');
            // this.getTestQuestionAnsDetails(page);
            this.snackBar.open('Timeout', '' , {duration: 2000});
            this.router.navigate(['/test/score']);
            this.pauseTimer();
            return false;
          } else {
            const dialogRef = this.dialog.open(CommonAlertComponent, {
              width: '250px',
              height: '300px',
              data: {
                     msg: 'Time Up',
                     btn : 'Next Question',
                     userID : this.userID,
                     group_id :  this.group_id,
                     questionId: this.questionId,
                     page: page
                    }
            });

            dialogRef.afterClosed().subscribe(result => {
              console.log(result);
              if (result.status == 'success') {
                // console.log('success')
                sessionStorage.setItem('setpage', result.page);
                this.router.navigate([this.router.url]);
              } else if (result.status == 'cancel') {
                this.snackBar.open('canceled', '' , {duration: 2000});
                sessionStorage.removeItem('setpage');
                this.router.navigate(['/search/test']);
              } else {
                this.snackBar.open('Error', '' , {duration: 2000});
                sessionStorage.removeItem('setpage');
                this.router.navigate(['/search/test']);
              }
            });
          }
        }
      } else {
        // this.timeLeft = 60;
      }
    }, 1000)
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  pauseTimer() {
    clearInterval(this.interval);
  }

  /** Get Question & answer details */
  getTestQuestionAnsDetails(page = '') {
    if (sessionStorage.getItem('setpage')) {
      this.nextPage = parseInt(sessionStorage.getItem('setpage')) + 1;
      // sessionStorage.removeItem('setpage');
    } else {
      this.nextPage = page == '' ? 1 : page + 1;
    }
    this.apiService.getRequest(constant.apiurl + constant.getTestQuestionAns + '?group=' + this.group_id + '&page=' + this.nextPage).subscribe(
      data => {
      this.resQuestionDetails = data;
      if (this.resQuestionDetails.status === 200 && this.resQuestionDetails.ok === true) {
        this.testQuestionDetails = this.resQuestionDetails.body.results;
        this.testQuestionCount = this.resQuestionDetails.body.count;
        this.questionId = this.testQuestionDetails[0].id;
        if (this.testQuestionCount === this.nextPage) {
          this.changeTxtSubmit = true;
        }
        this.startTimer1(this.nextPage, this.testQuestionCount);
      } else {
        sessionStorage.removeItem('setpage');
        this.router.navigate(['/search/test']);
      }
    }, err => {
      sessionStorage.removeItem('setpage');
      this.router.navigate(['/search/test']);
    });
  }

  onContinueTest(page) {
    // this.getTestQuestionAnsDetails(page);
    sessionStorage.setItem('setpage', page);
    this.continueDisable = true;
    if (this.testQuestionCount === this.nextPage) {
      sessionStorage.removeItem('setpage');
      // this.getTestQuestionAnsDetails(page);
      this.router.navigate(['/test/score']);
      this.pauseTimer();
    } else {
      this.router.navigate([this.router.url]);
    }
  }

  onClickAnswer(answer) {
    this.continueDisable = false;
    const params = {
      'answer': answer,
      'user': this.userID,
      'groups': this.group_id,
      'question': this.questionId
  };
    this.answerTheQuestion(params);
  }

  answerTheQuestion(params) {
    this.apiService.postRequest(constant.apiurl + constant.answerTestQuestions + '?group=' + this.group_id + '&user=' + this.userID, params).subscribe(
      data => {
      this.resQuestionAnswer = data;
      // console.log(this.resQuestionAnswer);
    }, err => {
      this.errorResQusAns = err;
      if (this.errorResQusAns.error.non_field_errors.length !== 0) {
        console.log(this.errorResQusAns.error.non_field_errors[0]);
      }
    });
  }
}
