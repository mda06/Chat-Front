import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {ChatParticipant} from '../dto/chat-participant';

@Injectable()
export class ChatService {
  // Basic vars
  private serverUrl = 'http://localhost:8080/socket';
  private stompClient;
  // Events
  private receivedMessage = new ReplaySubject<any>();
  receivedMessage$ = this.receivedMessage.asObservable();
  private loginMessage = new ReplaySubject<ChatParticipant>();
  loginMessage$ = this.loginMessage.asObservable();
  private logoutMessage = new ReplaySubject<ChatParticipant>();
  logoutMessage$ = this.logoutMessage.asObservable();
  private participants = new ReplaySubject<Array<ChatParticipant>>();
  participants$ = this.participants.asObservable();

  constructor() {
  }

  connect() {
    const ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    const that = this;
    this.stompClient.connect({}, function(_) {
      console.log('Connected successfully');
      that.initReceivedMessages();
      that.initLogins();
      that.initParticipants();
    });
  }

  private initReceivedMessages() {
    this.stompClient.subscribe('/chat', (msg) => {
      if (msg.body) {
        this.receivedMessage.next(msg.body);
      }
    });
  }

  private initParticipants() {
    this.stompClient.subscribe('/app/participants', msg => {
      if (msg.body) {
        this.participants.next(JSON.parse(msg.body));
      }
    });
  }

  private initLogins() {
    this.stompClient.subscribe('/chat/login', (msg) => {
      if (msg.body) {
        this.loginMessage.next(JSON.parse(msg.body));
      }
    });
    this.stompClient.subscribe('/chat/logout', (msg) => {
      if (msg.body) {
        this.logoutMessage.next(JSON.parse(msg.body));
      }
    });
  }

  sendMessage(msg: string) {
    this.stompClient.send('/app/send/message' , {}, msg);
  }

}
