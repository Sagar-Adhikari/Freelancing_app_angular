import { Injectable } from '@angular/core';
import { WebsocketService } from '../../services/ws/websocket.service';
import { Observable, Subject } from 'rxjs/Rx';

@Injectable()
export class ChatService {
  
  messages: Subject<any>;
  
  constructor(private wsService: WebsocketService) {
      this.messages = <Subject<any>>wsService
      .connect()
      .map((response: any): any => {
        return response;
      });
  }

  sendRoomname(roomname){
    this.wsService.connectTosocket(roomname);
  }

  deleteMsg(msg_id){
    this.messages.next(msg_id);
  }
  
  sendMsg(msg) {
    this.messages.next(msg);
  }

  sendTyping(username){
   this.messages.next(username); 
  }

}