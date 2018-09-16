import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {ReplaySubject} from 'rxjs/ReplaySubject';

@Injectable()
export class ChatService {
  // Basic vars
  private serverUrl = 'http://localhost:8080/socket';
  private stompClient;
  // Events
  private receivedMessage = new ReplaySubject<any>();
  receivedMessage$ = this.receivedMessage.asObservable();

  constructor() {
  }

  connect() {
    const ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    const that = this;
    this.stompClient.connect({}, function(_) {
      console.log('Connected successfully');
      that.initReceivedMessages();
    });
  }

  private initReceivedMessages() {
    this.stompClient.subscribe('/chat', (msg) => {
      if (msg.body) {
        this.receivedMessage.next(msg.body);
      }
    });
  }

  sendMessage(msg: string) {
    this.stompClient.send('/app/send/message' , {}, msg);
  }

}
