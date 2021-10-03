import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef, ElementRef, HostListener, Inject } from '@angular/core';
import { HttpHeaders, HttpResponse, HttpXsrfTokenExtractor, HttpClient } from '@angular/common/http';
import { MatSnackBar, MatTableDataSource, MatPaginator, MatSort, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatIcon, PageEvent } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { merge } from 'rxjs/observable/merge';
import { of as observableOf } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';
import { startWith } from 'rxjs/operators/startWith';
import { switchMap } from 'rxjs/operators/switchMap';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { constant } from '../../../../../data/constant';
import { ApiService } from '../../../../services/api/api.service';
import { Title, Meta, DOCUMENT } from '@angular/platform-browser';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { ChatService } from '../../../../services/chat/chat.service';
import { SettingsComponent } from './../../messages/settings/settings.component';
import { ShortcutComponent } from './../../messages/shortcut/shortcut.component';
import { AddRoomComponent } from './../../messages/add-room/add-room.component';

import * as moment from 'moment';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  
  recent_results:any;
  recent_room_list = [];

  all_recent_results:any;
  all_recent_room_list = [];
  constructor(private http: HttpClient,  public dialog: MatDialog, public snackBar: MatSnackBar, private apiService: ApiService, private router:Router) {}

  ngOnInit() {
  	this.getrecentinfo();
  	this.getlastroominfo();
  }

  getrecentinfo(){
    var api_url = constant.apiurl + constant.roomrecent+'?email='+this.apiService.decodejwts().email+'&days=30';   
    this.apiService.getRequest(api_url).subscribe(result => {
      this.recent_results = result;
    },error => {
      console.log('something went wrong');
    },() => {
      this.recent_results.body.map(item  => {
        item.new_date_format = moment(item.modified, "YYYYMMDD h:m:s").fromNow();
        return item;
      }).forEach(item => {
      this.recent_room_list.push(item);
    });  
    });

    // console.log(this.recent_room_list);
  }

  getlastroominfo(){
    var api_url = constant.apiurl + constant.roomlisting+'?search='+this.apiService.decodejwts().email+'&page=1';   
    this.apiService.getRequest(api_url).subscribe(result => {
      this.all_recent_results = result;
    },error => {
      console.log('something went wrong');
    },() => {
    	// console.log(this.all_recent_results);
    	this.all_recent_results.body.results.map(item  => {
    		item.new_date_format = moment(item.modified, "YYYYMMDD h:m:s").fromNow();
    		return item;
    	}).forEach(item => {
    		this.all_recent_room_list.push(item);
    	});  
    });

    // console.log(this.all_recent_room_list);
  }

  settingPopup(){
    const setting = this.dialog.open(SettingsComponent, {
    });
  }

  shortPopup(){
    const shortcut = this.dialog.open(ShortcutComponent, {
    });
  }

  addroom(){
    const addroom = this.dialog.open(AddRoomComponent, {
    });
  }

  getrecentroombysearch(event){
    	var api_url = constant.apiurl + constant.roomrecent+'?email='+this.apiService.decodejwts().email+'&days=30&search='+event.srcElement.value;   
    	this.apiService.getRequest(api_url).subscribe(result => {
    		this.recent_results = result;
    	},error => {
    		console.log('something went wrong');
    	},() => {
    		this.recent_room_list.length = 0;
    		this.recent_results.body.map(item  => {
    			item.new_date_format = moment(item.modified, "YYYYMMDD h:m:s").fromNow();
    			return item;
    		}).forEach(item => {
				this.recent_room_list.push(item);
			});	
    	});
    }

}
