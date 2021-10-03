import { forEach } from '@angular/router/src/utils/collection';
import { Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { constant } from './../../../../data/constant';
import { ApiService } from './../../../services/api/api.service';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Inject,
  TemplateRef,
} from '@angular/core';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import * as jstz from 'jstz';
const timezone = jstz.determine();

@Component({
  selector: 'app-work-diary',
  templateUrl: './work-diary.component.html',
  styleUrls: ['./work-diary.component.css'],
  providers: [],
})
export class WorkDiaryComponent implements OnInit {
  @ViewChild('dateTill') picker: ElementRef;
  tillDate: string = new Date().toDateString();

  showImage: boolean = false;
  time_logs: any = [];

  memo: string = '';
  selectedContractId: string;
  freelancerName: string;

  contracts = [];

  freelancer = [];
  filterDate = '';
  data: any = [];
  contractData: any = [];
  public value: number;
  checkedArr: any = [];
  loading: boolean = false;

  popupImagePath: any;

  timeMeridiem = 'AM';

  disabled: boolean = false;

  totalTimeTracked: string;

  constructor(
    private apiService: ApiService,
    private httpClient: HttpClient,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    const newDate = this.datePipe.transform(
      new Date().toDateString(),
      'yyyy-MM-dd'
    );
    const href = constant.apiurl + constant.savecontracts;
    this.apiService.getRequest(href).subscribe((x) => {
      this.loading = true;
      const responseData = x['body'];
      var rslt = responseData;
      rslt.results.map((data) => {
        this.selectedContractId = data.id;
        this.contracts.push({
          contract_id: data.id,
          contract_name: data.title,
        });
        this.freelancer.push({
          freelancer_id: data.freelancer.id,
          freelancer_name: data.freelancer.username,
        });
        this.freelancerName = data.freelancer.username;
      });
      this.getTimeTrackerDetails(this.selectedContractId, newDate);
      this.getTotalTimeTracked(this.selectedContractId, newDate);
    });
  }

  getTimeTrackerDetails(contractId: string, filterDate: string) {
    const url = constant.apiurl + constant.getTimeTracker;
    this.httpClient
      .get(url, {
        params: {
          contract_id: contractId,
          date: filterDate,
          timezone: encodeURI(timezone.name()),
        },
        observe: 'response',
      })
      .toPromise()
      .then((response) => {
        this.data = response['body'];
        if (this.data.time_logs.length > 0) {
          this.time_logs = this.data.time_logs;
        }
      })
      .catch(console.log);
  }

  contractChanged(value) {
    this.time_logs = [];
    const newDate = this.datePipe.transform(this.tillDate, 'yyyy-MM-dd');
    this.getTimeTrackerDetails(value, newDate);
    this.getTotalTimeTracked(value, newDate);
  }

  isWorking(hourIndex: number, boxIndex: number) {
    var hour_data = this.time_logs[hourIndex];

    var resp = false;

    this.showImage = false;

    hour_data.entities
      .filter((x) => x.status == 'w')
      .forEach((item) => {
        if (boxIndex >= item.startIndex && boxIndex <= item.endIndex) {
          if (hour_data.hour < 12) {
            this.timeMeridiem = 'AM';
          } else if (hour_data.hour - 12 === 12) {
            this.timeMeridiem = 'PM';
          } else {
            this.timeMeridiem = 'PM';
          }
          resp = true;
          this.showImage = true;
        }
      });
    return resp;
  }

  getScreenshotPath(hourIndex: number, boxIndex: number) {
    var hour_data = this.time_logs[hourIndex];

    this.showImage = false;

    var entityWImage = hour_data.entities.find(
      (x) =>
        x.status == 'w' && boxIndex >= x.startIndex && boxIndex <= x.endIndex
    );
    if (entityWImage != null) {
      var prependUrl = constant.imgurl + '/' + constant.screenshotImagePath;
      var resp =
        prependUrl +
        entityWImage.screenshot_path[boxIndex - entityWImage.startIndex];
      return resp;
    }
  }

  onChange(value) {
    this.tillDate = value.toDateString();
    const fd = this.datePipe.transform(this.tillDate, 'yyyy-MM-dd');
    this.time_logs = [];
    this.totalTimeTracked = '';
    this.getTimeTrackerDetails(this.selectedContractId, fd);
  }

  previousDate() {
    let newDate = new Date();
    newDate = new Date(
      new Date(this.tillDate).setDate(new Date(this.tillDate).getDate() - 1)
    );
    this.tillDate = newDate.toDateString();
    this.time_logs = [];
    this.totalTimeTracked = '';
    const fd = this.datePipe.transform(this.tillDate, 'yyyy-MM-dd');
    this.getTimeTrackerDetails(this.selectedContractId, fd);
    this.getTotalTimeTracked(this.selectedContractId, fd);
  }

  nextDate() {
    let newDate = new Date();
    newDate = new Date(
      new Date(this.tillDate).setDate(new Date(this.tillDate).getDate() + 1)
    );
    this.tillDate = newDate.toDateString();
    this.time_logs = [];
    this.totalTimeTracked = '';
    const fd = this.datePipe.transform(this.tillDate, 'yyyy-MM-dd');
    this.getTimeTrackerDetails(this.selectedContractId, fd);
    this.getTotalTimeTracked(this.selectedContractId, fd);
  }

  deleteDialog(templateRef: any) {
    let dialogRef = this.dialog.open(templateRef, {
      width: '250px',
      height: '250px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  updateDialog(templateRef: any) {
    let dialogRef = this.dialog.open(templateRef, {
      width: '50%',
      height: '350px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  checkBoxValueChange($event, hourIndex: number, boxIndex: number) {
    var hour_data = this.time_logs[hourIndex];
    var value = $event.source.value;
    if ($event.checked == true) {
      this.disabled = true;
      this.checkedArr.push(value);
      if (this.checkedArr.length == 0) {
        this.disabled = false;
        this.memo = '';
      } else if (this.checkedArr.length == 1) {
        hour_data.entities
          .filter((x) => x.id == value)
          .forEach((item) => {            
              this.memo = item.memo;
          });
      }else{
        this.memo = '';
      }
    } else {
      const index = this.checkedArr.indexOf(value);
      this.checkedArr.splice(index, 1);
      if (this.checkedArr.length == 0) {
        this.disabled = false;
      } 
    }

  }

  deleteScreenshot() {
    const fd = this.datePipe.transform(this.tillDate, 'yyyy-MM-dd');
    const arr = this.checkedArr.join(',');
    const ids = arr.split(',');
    const deleteUrl = constant.apiurl + constant.deleteMemos;
    this.apiService
      .putRequest(deleteUrl, { listOfIds: ids })
      .subscribe((items) => {
        if (items) {
          this.snackBar.open('Memo Deleted Successfully!');
          this.getTimeTrackerDetails(this.selectedContractId, fd);
          this.getTotalTimeTracked(this.selectedContractId, fd);
          setTimeout(() => {
            this.snackBar.dismiss();
          }, 2000);
        } else {
          this.snackBar.open('Something Went Wrong!');
        }
      });
    this.dialog.closeAll();
  }

  updateScreenshot() {
    const fd = this.datePipe.transform(this.tillDate, 'yyyy-MM-dd');
    const memo = this.memo;
    const arr = this.checkedArr.join(',');
    const ids = arr.split(',');

    const updateUrl = constant.apiurl + constant.updateMemos;
    this.apiService
      .putRequest(updateUrl, { listOfIds: ids, memo: memo })
      .subscribe((item) => {
        if (item) {
          this.snackBar.open('Memo Updated Successfully!');
          this.getTimeTrackerDetails(this.selectedContractId, fd);
          this.getTotalTimeTracked(this.selectedContractId, fd);
          setTimeout(() => {
            this.snackBar.dismiss();
          }, 2000);
        } else {
          this.snackBar.open('Something Went Wrong!');
        }
      });
    this.dialog.closeAll();
  }

  imageDialog(templateRef: any, image) {
    this.popupImagePath = image;
    let dialogRef = this.dialog.open(templateRef, {
      width: '1500px',
      height: 'auto',
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  getMatCheckedValue(hourIndex: number, boxIndex: number) {
    var hour_data = this.time_logs[hourIndex];

    this.showImage = false;

    var entityWId = hour_data.entities.find(
      (x) =>
        x.status == 'w' && boxIndex >= x.startIndex && boxIndex <= x.endIndex
    );

    if (entityWId != null) {
      var resp = entityWId.id[boxIndex - entityWId.startIndex];
      return resp;
    }
  }

  getTotalTimeTracked(contractId: string, filterDate: string) {
    const url = constant.apiurl + constant.totalTimeTracked;
    this.httpClient
      .get(url, {
        params: {
          contract_id: contractId, //query params
          date: filterDate,
        },
        observe: 'response',
      })
      .toPromise()
      .then((response) => {
        this.data = response['body'];
        console.log('data:',this.data);
        var timeTracked = this.data.daily_minutes_worked;
        this.totalTimeTracked = this.minutesConvertToHour(timeTracked);
      })
      .catch(console.log);
  }

  minutesConvertToHour(minute) {
    var num = minute;
    var hours = num / 60;
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return rhours + ':' + rminutes + 'hrs';
  }
}
