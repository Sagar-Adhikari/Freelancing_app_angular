import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import * as Rx from 'rxjs/Rx';
import { environment } from '../../../environments/environment';
import { ApiService } from '../api/api.service';

@Injectable()
export class WebsocketService {

  private socket;

  constructor(private apiService: ApiService,) {
    
    this.socket = io(environment.chatUrl, {
      query: {
        user_id : this.apiService.decodejwts().userid,
        token: localStorage.getItem('exp_token')
      }
    } ); 
  }

  connectTosocket(data) {
    this.socket.emit('remote nepal join room', data);  
  }

  connect(): Rx.Subject<MessageEvent> {

    let observable = new Observable(observer => {
        this.socket.on('remote nepal message', (data) => {
          observer.next(data);
        });

        this.socket.on('remote nepal typing', (data) => {
          observer.next(data);
        });

        this.socket.on('remote nepal delete message', (data) => {
          observer.next(data);
        });

        return () => {
          this.socket.disconnect();
        }
    });
    
    let observer = {
        next: (data: any) => {
          if(data.type != '' && typeof data.type != 'undefined' && data.type=='typing'){
            this.socket.emit('remote nepal typing', data); 
          }else if(data.type != '' && typeof data.type != 'undefined' && data.type=='chat'){
            this.socket.emit('remote nepal message', data); 
          }else if(data.type != '' && typeof data.type != 'undefined' && data.type=='delete'){
            this.socket.emit('remote nepal delete message', data); 
          }
        }
    };

    return Rx.Subject.create(observer, observable);
  }

}