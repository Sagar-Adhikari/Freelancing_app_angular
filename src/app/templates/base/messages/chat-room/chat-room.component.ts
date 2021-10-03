import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef, ElementRef, HostListener, Inject, OnDestroy } from '@angular/core';
import { ChatService } from '../../../../services/chat/chat.service';
import { WebsocketService } from '../../../../services/ws/websocket.service';
import { ApiService } from '../../../../services/api/api.service';
import { FileUploadService } from '../../../../services/file-upload/file-upload.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { constant } from '../../../../../data/constant';
import * as io from 'socket.io-client';
import { AddRoomComponent } from './../../messages/add-room/add-room.component';
import { DeleteMessageComponent } from './../../messages/delete-message/delete-message.component';
import { MatSnackBar, MatTableDataSource, MatPaginator, MatSort, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatIcon, PageEvent } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { EditRoomComponent } from './../../messages/edit-room/edit-room.component';
import { SettingsComponent } from './../../messages/settings/settings.component';
import { ShortcutComponent } from './../../messages/shortcut/shortcut.component';
import { AddPeopleComponent } from './../../messages/add-people/add-people.component';
import { NotifyService } from '../../../../services/notification/notify.service';
import { SidebarComponent } from './../../messages/sidebar/sidebar.component';
import { UserService } from '../../../../services/sync/user.service';

import * as moment from 'moment';

import { Subject } from "rxjs/Subject";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/mergeMap";

@Component({
	selector: 'app-chat-room',
	templateUrl: './chat-room.component.html',
	styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit, AfterViewInit, OnDestroy {
	pendingSend:Boolean = false;
	displayMsg = [];
	displaymg = [];
	displayPreMsg = [];
	displayTyping = [];
	prevQteMsg = [];
	filesInfo = [];
	result = [];
	pushMsg = [];
	displaySearchMsg = [];
	current_id:any = this.apiService.decodejwts().userid;
	current_user_name:any = this.apiService.decodejwts().username;
	errormessage:string = "";
	results:any;
	qte_results:any;
	file_results:any;
	sh_results:any;
	current_room:string = "";
	typing_status = false;
	url = [];

	msgFiles = new FormData();
	fileUploaded = false;
	file: File;
	uploadedFile = [];
	pushFiles = [];
	uploadinfo:any;
	file_info_all = [];
	result_url = [];
	recent_results:any;
	surl = [];
	api_url = constant.imgurl;
	error = false;
	hide_class:any;
	prevQteMsginfo = [];
	created_current_room:any;
	current_room_id:any;
	isFiles:boolean = true;
	isSearch:boolean = false;
	search_text: string = '';
	go_to_room:any;
	audio:any;
	recent_room_list = [];
	norecords:boolean = true;

  	//pagination
  	inc_page:number = 1;
  	throttle = 400;
  	scrollDistance = 4;
  	scrollUpDistance = 4;  	
  	total_no_page:number;
  	remain:number;
  	loadMorebtn:boolean;
  	file_default_page = 1;
  	file_inc_page:number = 1;
  	total_file_page:number;
  	scroll_status:boolean = false;

  	//notes
  	default_notes:boolean = true;
  	saved_notes:boolean = false;
  	textarea_notes:boolean = false;
  	saved_notes_db:any;

  	files_block:boolean = false;
  	notes_block:boolean = false;
  	notes_results:any;
  	save_notes_results:any;
	  push_dates = [];
	  msg_mutation_observer: MutationObserver;

	  totalArray:any;
	  hideLayout = false;
	  job_id: any;
	  init_msg_scroll_complete = false;

  	private subject: Subject<string> = new Subject();

  	//user avatar
  	user_avatar_url = constant.apiurl + constant.user_avatar;

  	@ViewChild('msgfs') messagefiles: any;
  	@ViewChild('to_send_msg') to_send_msg: ElementRef;
	  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
	  @ViewChild('msgsContainer') private msgsContainer: ElementRef;

  	settings_result:any;
  	room_users:any;
  	message_type:number = 1;

  	users_block:boolean = false;
  	room_owner:any;
		invite_users_id:any;
		proposal_id:any;
  	user_type: string;
  	constructor(private _hotkeysService: HotkeysService, private chat: ChatService, private apiService: ApiService, private router:Router, 
  		private route:ActivatedRoute, private ws: WebsocketService, public dialog: MatDialog, private DomSan: DomSanitizer, private _notificationService: NotifyService, private syncVar: UserService){ 
   		
   		this.user_type = this.apiService.decodejwts().user_type;

  		this._notificationService.requestPermission();

  		this.loadfiles(this.route.snapshot.paramMap.get('id'));

  		this.router.routeReuseStrategy.shouldReuseRoute = function(){
  			return false;
  		}
  		this.router.events.subscribe((evt) => {
  			if (evt instanceof NavigationEnd) {
  				this.router.navigated = false;
  				window.scrollTo(0, 0);
  			}
  		});

  		this._hotkeysService.add(new Hotkey('ctrl+f', (event: KeyboardEvent): boolean => {
  			this.isFiles = false;
  			this.files_block = true;
  			this.isSearch = true;
			this.notes_block = false;
			this.users_block = false;
  			return false;
  		}));

  		this._hotkeysService.add(new Hotkey('alt+up', (event: KeyboardEvent): boolean => {
  			this.gotoRoom('next');
  			return false;
  		}));

  		this._hotkeysService.add(new Hotkey('alt+down', (event: KeyboardEvent): boolean => {
  			this.gotoRoom('prev');
  			return false;
  		}));

  		this._hotkeysService.add(new Hotkey('alt+/', (event: KeyboardEvent): boolean => {
  			this.shortPopup();
  			return false;
  		}));

  	}

  	ngOnInit() {

  		if(localStorage.getItem('message_type')=='2'){
  			this.message_type = 2;
		  }
		  
  		this.getrecentinfo();
		this.getinfo();
		this.getNotes();
		this.doScrollpush();
  		this.chat.messages.subscribe(msg => {
  			if(msg.type=='chat'){
  				if(localStorage.getItem('sound_status')=='yes'){
  					this.audio = new Audio();
	  				this.audio.src = "assets/sound/to-the-point.mp3";
	  				this.audio.load();
	  				this.audio.play();	
  				}
  				// this.displayMsg.push(msg);
  				var created_at = moment(msg.current_date_time).format("YYYY-MM-DD");
				var stamp = new Date(created_at).getTime();

				if(this.push_dates.indexOf(stamp)!== -1) {
				}else{
					this.push_dates.push(stamp);
				}

				if(this.displaymg.hasOwnProperty(stamp)==false) {
					this.displaymg[stamp] = [];							
				}

				this.displaymg[stamp].push(msg);
  				// console.log(msg);
  				if(this.apiService.decodejwts().userid!=msg.user_id){
  					let data: Array < any >= [];
			        data.push({
			            'title': msg.user_name,
			            'alertContent': msg.message,
			            'icon': 'assets/images/work-innerlogo.png'
			        });
	      
	        		this._notificationService.generateNotification(data);	
  				}
  			}else if(msg.type=='delete'){
  				var element = document.getElementById("msg_container_"+msg.msg);
  				element.classList.add("hide");
  			}else{
  				this.typing_status = true;
  				if(this.displayTyping.indexOf(msg.user_name) == -1) {
  					this.displayTyping.push(msg.user_name);
  				}
  				setTimeout(() => {
  					this.displayTyping = [];
  					this.typing_status = false;
  				}, 2500); 
  			}
  		});

  		this.subject.debounceTime(500).subscribe(searchTextValue => {
		    this.saveNotes(searchTextValue);
		});
	  }
	  
	ngOnDestroy() {
		this.msg_mutation_observer.disconnect();
	}

    ngAfterViewInit(){
		var that = this;
		this.msg_mutation_observer = new MutationObserver(function (mutationList) {			
			if(!that.init_msg_scroll_complete) {
				//ensure scrolls to bottom in the first message load
				that.scrollToBottom();				
				that.init_msg_scroll_complete = true;

				//also scroll the browser window
				window.scrollTo(0,document.body.scrollHeight);
			} 
			else if(mutationList != null && mutationList.length > 0 && mutationList.length <= 3) {
				// each mutationList has at least 3 items
				// <=3 restricts from scrolling if user is scrolling up to view older messages				
				that.scrollToBottom();
			}
		});
		
		this.msg_mutation_observer.observe(this.msgsContainer.nativeElement, { 
			childList:true, subtree: true
		});

    	this.scroll_status = true;
    }

    scrollToBottom(): void {
    	try {
    		this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    	} catch(err) { }                 
    }

    gotoRoom(type){
    	const id = this.route.snapshot.paramMap.get('id');
    	var api_url = constant.apiurl + constant.roomnext+'?email='+this.apiService.decodejwts().email+'&room='+id+'&type='+type+'&days=30';   
    	this.apiService.getRequest(api_url).subscribe(result => {
    		this.go_to_room = result;
    	},error => {
    		console.log('something went wrong');
    	},() => {
    		this.router.navigated = false;
    		this.router.navigate(['/chat-room/'+this.go_to_room.body.id]);
    	});
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
    }

    getinfo(){
		this.hideLayout = this.route.snapshot.paramMap.get('mid') !== null ? true : false;
		const id = this.route.snapshot.paramMap.get('id');
    	var api_url = constant.apiurl + constant.roomlisting+id+'/';   
    	this.apiService.getRequest(api_url).subscribe(result => {
			this.results = result;
    	},error => {
    		console.log('something went wrong');
    	},() => {
    		this.current_room_id = this.results.body.id;
    		this.current_room = this.results.body.room_name;
    		this.created_current_room = this.results.body.created;
    		this.room_users = this.results.body.user_detail;
				this.room_owner = this.results.body.user;
				this.invite_users_id = this.results.body.invite_users_id;
				this.proposal_id =  this.results.body.proposal_id;
			this.total_no_page = Math.ceil(this.results.body.message_count/constant.itemsPerPage);
			this.chat.sendRoomname(this.current_room);
			this.job_id = this.results.body.job;
		});
	}
	
	doScrollpush() {
		var promise = new Promise((resolve, reject) => {
			const id = this.route.snapshot.paramMap.get('id');
			var api_url = constant.apiurl + constant.msglisting+'?page='+this.inc_page+'&room='+id;
			this.apiService.getRequest(api_url).subscribe(result => {
				this.results = result;
			},error => {
				console.log('something went wrong');
			},() => {
				this.results.body.results.map(item  => {
					var prs = JSON.parse(item.file);
					var created_at = moment(item.created).format("YYYY-MM-DD");
					var custom_format;
					var stamp = new Date(created_at).getTime();
					if(this.push_dates.indexOf(stamp)!== -1) {
						custom_format = '';
					}else{
						this.push_dates.unshift(stamp);
						custom_format = moment(created_at).format("Do MMM YY");
					}
					return {'user_id':item.user, 'message':item.chat_message, 'current_date_time': item.created, 'file_ids': prs, file_info: item.file_info, msg_id: item.id , message_info: item.message_info };
				}).forEach(item => {
			 		// this.displayMsg.push(item); 
			 		// this.displayMsg.splice(0, 0, item);
			 		var created_at = moment(item.current_date_time).format("YYYY-MM-DD");
					var stamp = new Date(created_at).getTime();

					if(this.displaymg.hasOwnProperty(stamp)==false) {
						this.displaymg[stamp] = [];							
					}
					this.displaymg[stamp].unshift(item);
			 		// this.displayMsg.unshift(item);		 		
			 	});	
			 		 
			});	

			setTimeout(() => {
				resolve();
			}, 3000);		
		});

		// console.log(this.push_dates);

		return promise;
	}

	getSettings(){
	    const userlists = constant.apiurl + constant.msgsettings + '?user=' + this.apiService.decodejwts().userid + '&type=' + this.apiService.decodejwts().user_type;
	    this.apiService.getRequest(userlists).subscribe(
	      row => {
	        this.settings_result = row;
	        localStorage.setItem('sound_status', this.settings_result.body['0'].sound_status);
	        this.message_type = this.settings_result.body['0'].message_type;
	      },
	      err => {
	        console.log(err);
	      });
	}

	readUrl(event:any) {
		if (event.target.files.length>0) {
			for (var i = event.target.files.length - 1; i >= 0; i--) {
				// this.msgFiles = new FormData();
				var file_ext = event.target.files[i].name.split('.').pop(); 
				var file_type = event.target.files[i].type;
				var file_size = event.target.files[i].size;
				var file_name = event.target.files[i].name;
				var img_type = ['image/gif', 'image/jpeg', 'image/jpg', 'image/png'];
				var excel    = ['application/vnd.ms-excel', 'application/vnd.ms-powerpoint', 'application/msword', 'application/vnd.ms-excel', 'application/zip', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
				var adobe    = ['application/pdf'];
				if(img_type.indexOf(file_type) > -1 || excel.indexOf(file_type) > -1 || adobe.indexOf(file_type) > -1){
					if(img_type.indexOf(file_type) > -1){
						const u = (window.URL) ? window.URL.createObjectURL(event.target.files[i]) : (window as any).webkitURL.createObjectURL(event.target.files[i]);
						this.url.push({'img': this.DomSan.bypassSecurityTrustResourceUrl(u) , 'size': event.target.files[i].size, 'file_name': event.target.files[i].name});

					}else if(excel.indexOf(file_type) > -1){
						this.url.push({'img': constant.siteBaseUrl+'/assets/images/thumbimg/docthumb.png', 'size':event.target.files[i].size, 'file_name': event.target.files[i].name});
					}else if(adobe.indexOf(file_type) > -1){
						this.url.push({'img': constant.siteBaseUrl+'/assets/images/thumbimg/pdfthumb.png', 'size':event.target.files[i].size, 'file_name': event.target.files[i].name});
					}

					this.pushFiles.push(event.target.files[i]);
				}else{
					this.syncVar.snackMessage('Allow only image, pdf and docs');
				}			
			}
		}
	}

	dlmsg(msg_id){
		const dialogRef = this.dialog.open(DeleteMessageComponent, { data: {id: msg_id, from:'msg'}
	});

		dialogRef.afterClosed().subscribe(result => {
			if (result === 1) {
				var element = document.getElementById("msg_container_"+msg_id);
				element.classList.add("hide");
				this.chat.deleteMsg({type:'delete', msg:msg_id});
			}
		});
	}

	qtemsg(msg_id){
		this.prevQteMsg.length = 0;
		var api_url = constant.apiurl + constant.msglisting+msg_id;   
		this.apiService.getRequest(api_url).subscribe(result => {
			this.qte_results = result;
		},error => {
			console.log('something went wrong');
		},() => {
			var prs = JSON.parse(this.qte_results.body.file);
			this.prevQteMsg.push({'user':this.qte_results.body.user, 'chat_message':this.qte_results.body.chat_message, 'created': this.qte_results.body.created, 'file_ids': prs, file_info: this.qte_results.body.file_info, msg_id: this.qte_results.body.id });
			this.prevQteMsginfo.push(this.qte_results.body.id);
		});
	}

	removeqte(id){
		this.prevQteMsg.splice(id, 1);
		this.prevQteMsginfo.splice(id, 1);
	}

	removefiles(id){
		this.url.splice(id, 1);
		this.pushFiles.splice(id, 1);
	}

	loadfiles(room_id){
		var api_url = constant.apiurl + constant.filelisting+'?page='+this.file_default_page+'&room='+room_id;   
		this.apiService.getRequest(api_url).subscribe(result => {
			this.file_results = result;
		},error => {
			console.log('something went wrong');
		},() => {
			this.total_file_page = Math.ceil(this.file_results.body.count/constant.itemsPerPage);
			this.file_results.body.results.map(item  => {
				return  item;
			}).forEach(item => { this.norecords=false; this.filesInfo.push(item); });	

			if(this.file_default_page===this.total_file_page){
				this.loadMorebtn = false;
			}else if(this.file_default_page<this.total_file_page){
				this.loadMorebtn = true;
			}	
		});
	}

	loadMorefiles(room_id){
		this.file_inc_page += 1;
		this.file_default_page = this.file_inc_page;
		if(this.file_inc_page<=this.total_file_page){
			this.loadfiles(room_id);
		}
	}

	select(vs){
		this.to_send_msg.nativeElement.value = this.to_send_msg.nativeElement.value+vs;
	}

	onTypingChange(value){
		this.chat.sendTyping({type:'typing', user_name: this.current_user_name});
		if(value == null || value == ''){
			this.pendingSend = false;
		} else {
			this.pendingSend = true;
		}
	}

	doUploads() {
		const rm = this.pushFiles.length-1;
		var promise = new Promise((resolve, reject) => {
			if(this.url.length>0){
				const msgFiles = new FormData();
				for (var i = 0; i < this.pushFiles.length; i++) {
					this.msgFiles.append('file', this.pushFiles[i]);
					this.msgFiles.append('user', this.apiService.decodejwts().userid);
					this.msgFiles.append('type', 'Messages');
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

	sendMessage() {
		// this.to_send_msg.nativeElement.value.trim() != '' && 
		if ((this.to_send_msg.nativeElement.value != '' && typeof this.to_send_msg.nativeElement.value != 'undefined') || (this.url.length>0)) {

			const id = this.route.snapshot.paramMap.get('id');
			const dt = new Date();
			if(this.url.length>0){
				this.doUploads().then(
					(val) => {
						this.chat.sendMsg({type:'chat', user_id: this.apiService.decodejwts().userid, message: this.to_send_msg.nativeElement.value, current_date_time:dt, roomno: this.current_room, hrs: `JWT ${localStorage.getItem('exp_token')}`, room_id: id, file_ids:this.uploadedFile, file_info: this.file_info_all, msg_id: 0, qte:this.prevQteMsginfo, message_info: this.prevQteMsg } ); 
						this.file_info_all = [];
						this.uploadedFile = [];
						this.pushFiles = [];
						this.prevQteMsginfo = [];
						this.prevQteMsg = [];
						this.messagefiles.nativeElement.value = "";
						this.url.length = 0;
						this.to_send_msg.nativeElement.value = '';
						this.filesInfo = []; 
						this.file_default_page = 1; 
						setTimeout(() => {
							this.loadfiles(id);
						}, 500);	

					},
					(err) => { console.error(err); }
					);			
			}else{
				this.chat.sendMsg({type:'chat', user_id: this.apiService.decodejwts().userid, message: this.to_send_msg.nativeElement.value, current_date_time:dt, roomno: this.current_room, hrs: `JWT ${localStorage.getItem('exp_token')}`, room_id: id, file_ids:this.uploadedFile, file_info: this.file_info_all, msg_id: 0, qte:this.prevQteMsginfo, message_info: this.prevQteMsg} );
				this.messagefiles.nativeElement.value = "";
				this.to_send_msg.nativeElement.value = '';
				this.prevQteMsginfo = [];
				this.prevQteMsg = [];				
			}			
		}
	}

	onScrollUp () {	
		if(this.total_no_page > 0 && this.scroll_status==true && this.inc_page < this.total_no_page){
			this.inc_page ++ ;
			this.doScrollpush();
		}	
	}

	searchAPI(txt){
		this.displaySearchMsg = [];
		const id = this.route.snapshot.paramMap.get('id');
		var api_url = constant.apiurl + constant.msglisting+'?search='+txt+'&room='+id;
		this.apiService.getRequest(api_url).subscribe(result => {
			this.sh_results = result;
		},error => {
			console.log('something went wrong');
		},() => {
			this.sh_results.body.results.map(item  => {
				var prs = JSON.parse(item.file);
				return {'user_id':item.user, 'message':item.chat_message, 'current_date_time': item.created, 'file_ids': prs, file_info: item.file_info, msg_id: item.id , message_info: item.message_info };
			}).forEach(item => {
				this.displaySearchMsg.push(item);  			 		
			});		 	
		});
	}

	closeSearch(){
		this.displaySearchMsg = [];
		this.files_block = true;
		this.isFiles = true;
		this.isSearch = false;
		this.notes_block = false;
		this.users_block = false;
	}


	closeFiles(){
		this.displaySearchMsg = [];
		this.files_block = false;
		this.isFiles = false;
		this.isSearch = false;
		this.notes_block = true;
		this.users_block = false;
	}

	search(eve) {
		this.search_text = '';
		if (eve.target.value) {
			this.searchAPI(eve.target.value);
		}
	}

	searchaction() {
		if (this.search_text.length > 0) {
			this.searchAPI(this.search_text);
			this.search_text = '';
		}
	}

	addroom(){
		const addroom = this.dialog.open(AddRoomComponent, {
		});
	}

	editroom(room_id){
		const editroom = this.dialog.open(EditRoomComponent, { data: { id : room_id } });
	}

	settingPopup(){
		// const setting = this.dialog.open(SettingsComponent, {
		// });
		alert('dfdf');
	}

	shortPopup(){
		const shortcut = this.dialog.open(ShortcutComponent, {
		});
	}

	peoplePopup(){
		const people = this.dialog.open(AddPeopleComponent, {
			disableClose: true,
	        data: {'room_id': this.route.snapshot.paramMap.get('id')}
		});
	}

	personalNoteaction(event){
		this.saved_notes_db = event;
	}

	showNotes(val:number){
		this.default_notes = false;
		this.textarea_notes = true;
		this.saved_notes = false;
	}

	@HostListener('document:click', ['$event']) clickedOutside($event){
	    // console.log("CLICKED OUTSIDE");
	    if (this.saved_notes_db != '' && typeof this.saved_notes_db != 'undefined') {
			this.saved_notes = true;
			this.default_notes = false;
			this.textarea_notes = false;	
		}else{
			this.saved_notes = false;
			this.default_notes = true;
			this.textarea_notes = false;	
		}
	}

	clickedInside($event: Event){
	    $event.preventDefault();
	    $event.stopPropagation();  // <- that will stop propagation on lower layers
	    this.default_notes = false;
		this.textarea_notes = true;
		this.saved_notes = false;
	    // console.log("CLICKED INSIDE, MENU WON'T HIDE");
	}

	onKeyUp(event){
	  this.subject.next(event.srcElement.value);
	}

	saveNotes(searchTextValue: any){
      var href = constant.apiurl + constant.savenotes;
      var params = {
        room: this.route.snapshot.paramMap.get('id'),
        user: this.apiService.decodejwts().userid,
        notes: searchTextValue
      };
      this.apiService.putRequest(href, params).subscribe(result => {
        this.save_notes_results = result;
      }, error => {
        console.log('something went wrong');
      }, () => {

      });
	}

	getNotes(){
		const id = this.route.snapshot.paramMap.get('id');
		var api_url = constant.apiurl + constant.getnotes+'?room='+this.route.snapshot.paramMap.get('id')+'&user='+this.apiService.decodejwts().userid;
		this.apiService.getRequest(api_url).subscribe(result => {
			this.notes_results = result;
		},error => {
			console.log('something went wrong');
		},() => {
			if(this.notes_results.body.count>0){
				this.saved_notes_db = this.notes_results.body.results["0"].notes;	 		
			}
		});
	}

	showUsers(){
		this.users_block = true;
		this.displaySearchMsg = [];
		this.files_block = false;
		this.isFiles = false;
		this.isSearch = false;
		this.notes_block = false;
	}

	removeuser(email:any){
		const dialogRefremove = this.dialog.open(DeleteMessageComponent, { data: {room_id:this.route.snapshot.paramMap.get('id'), email: email, from:'remove_user'}
		});

		dialogRefremove.afterClosed().subscribe(result => {
			console.log(result);
			if (result === 1) {
				this.syncVar.snackMessage('You are removed from is chat');
			}
		});
	}

}
