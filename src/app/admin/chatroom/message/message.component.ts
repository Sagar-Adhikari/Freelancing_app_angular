import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef, ElementRef, HostListener, Inject } from '@angular/core';
import { ChatService } from '../../../services/chat/chat.service';
import { WebsocketService } from '../../../services/ws/websocket.service';
import { ApiService } from '../../../services/api/api.service';
import { UserService } from '../../../services/sync/user.service';
import { FileUploadService } from '../../../services/file-upload/file-upload.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { constant } from '../../../../data/constant';
import * as io from 'socket.io-client';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSnackBar, MatTableDataSource, MatPaginator, MatSort, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatIcon, PageEvent } from '@angular/material';
import * as moment from 'moment';
import { Subject } from "rxjs/Subject";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/mergeMap";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
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
  	no_page:number;
  	sum = 10;
  	inc_page:number = 0;
  	throttle = 400;
  	scrollDistance = 4;
  	scrollUpDistance = 4;
  	default_page = 1;
  	start_no = 0;
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

	  totalArray:any;
	  hideLayout = false;

  	private subject: Subject<string> = new Subject();

  	//user avatar
  	user_avatar_url = constant.apiurl + constant.user_avatar;

  	@ViewChild('msgfs') messagefiles: any;
  	@ViewChild('to_send_msg') to_send_msg: ElementRef;
  	@ViewChild('scrollMe') private myScrollContainer: ElementRef;

  	settings_result:any;
  	room_users:any;
  	message_type:number = 1;

  	users_block:boolean = false;
  	room_owner:any;
		invite_users_id:any;
		proposal_id:any;
  	user_type: string;

  constructor(private chat: ChatService, private apiService: ApiService, private router:Router, 
  		private route:ActivatedRoute, private ws: WebsocketService, public dialog: MatDialog, private DomSan: DomSanitizer, private syncVar: UserService) { 
   		
   		this.user_type = this.apiService.decodejwts().user_type;


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



  

  	 }

  ngOnInit() {


  		if(localStorage.getItem('message_type')=='2'){
  			this.message_type = 2;
  		}

  		this.scrollToBottom();
  		this.getinfo();
  		setTimeout(() => {
  			this.getchatmsg(1);
  		}, 900);
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
  			this.scrollToBottom();
  		});
  	
  }
  ngAfterViewChecked() {        
        // this.scrollToBottom();     
    } 

    ngAfterViewInit(){
    	this.scroll_status = true;
    }

    scrollToBottom(): void {
    	try {
    		this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    	} catch(err) { }                 
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
				console.log("proposal id ",this.results.body.proposal_id)
				this.proposal_id =  this.results.body.proposal_id;
    		this.total_no_page = Math.ceil(this.results.body.message_count/constant.itemsPerPage);
    		this.chat.sendRoomname(this.current_room);
    	});
    }

    getchatmsg(type:number){
    	if(type==1){
    		this.no_page  = this.total_no_page;
    		this.inc_page = this.no_page-1;
    		var sno = 1;
    		for (var i = this.total_no_page; i > 0; i--) {
    			if(sno<3){
    				const id = this.route.snapshot.paramMap.get('id');
    				var api_url = constant.apiurl + constant.msglisting+'?page='+i+'&room='+id;   
    				this.apiService.getRequest(api_url).subscribe(result => {
    					this.results = result;
    				},error => {
    					console.log('something went wrong');
    				},() => {
						// this.no_page = Math.round(this.results.body.count/constant.itemsPerPage);
						this.results.body.results.reverse().map(item  => {
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
							
							return {'user_id':item.user,'name':item.name, 'message':item.chat_message, 'current_date_time': item.created, 'file_ids': prs, file_info: item.file_info, msg_id: item.id , message_info: item.message_info };
						}).forEach(item => {
							var created_at = moment(item.current_date_time).format("YYYY-MM-DD");
							var stamp = new Date(created_at).getTime();

							if(this.displaymg.hasOwnProperty(stamp)==false) {
								this.displaymg[stamp] = [];							
							}

							if(sno==1){
								// this.displayMsg.push(item); 
								this.displaymg[stamp].push(item);	
							}else{
								// this.displayMsg.unshift(item); 
								this.displaymg[stamp].unshift(item);
							}		

						});	
							
					});
    			}

    			sno++;
    		}

    	}
		// console.log(this.displayMsg);
		// console.log(this.displaymg);
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
				var excel    = ['application/vnd.ms-excel', 'application/vnd.ms-powerpoint','application/msword', 'application/vnd.ms-excel', 'application/zip','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
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

	doScrollpush() {
		var promise = new Promise((resolve, reject) => {
			const id = this.route.snapshot.paramMap.get('id');
			var api_url = constant.apiurl + constant.msglisting+'?page='+this.default_page+'&room='+id;
			this.apiService.getRequest(api_url).subscribe(result => {
				this.results = result;
			},error => {
				console.log('something went wrong');
			},() => {
				this.results.body.results.reverse().map(item  => {
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
					return {'user_id':item.user,'name':item.name, 'message':item.chat_message, 'current_date_time': item.created, 'file_ids': prs, file_info: item.file_info, msg_id: item.id , message_info: item.message_info };
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

	onScrollUp () {	
		// this.inc_page += 1;
		if(this.inc_page>0 && this.scroll_status==true){
			this.inc_page -= 1;
			this.start_no = this.sum+1;
			this.sum +=10;
			this.default_page = this.inc_page;
			if(this.inc_page<=this.no_page && this.inc_page!=0){
				// this.getchatmsg(2);	
				this.doScrollpush();			
			}
		}	
	}

}
