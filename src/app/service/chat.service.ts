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
  private _sessionId: string;
  // Events
  private receivedMessage = new ReplaySubject<any>();
  receivedMessage$ = this.receivedMessage.asObservable();
  private loginMessage = new ReplaySubject<ChatParticipant>();
  loginMessage$ = this.loginMessage.asObservable();
  private logoutMessage = new ReplaySubject<ChatParticipant>();
  logoutMessage$ = this.logoutMessage.asObservable();
  private participants = new ReplaySubject<Array<ChatParticipant>>();
  participants$ = this.participants.asObservable();
  private participantUpdate = new ReplaySubject<Array<ChatParticipant>>();
  participantUpdate$ = this.participantUpdate.asObservable();

  constructor() {
  }

  connect() {
    const ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    const that = this;
    this.stompClient.connect({}, function(_) {
      that._sessionId = /\/([^\/]+)\/websocket/.exec(ws._transport.url)[1];
      console.log('Connected as ', that._sessionId);
      that.initReceivedMessages();
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
    this.stompClient.subscribe('/app/participant/all', msg => {
      if (msg.body) {
        this.participants.next(JSON.parse(msg.body));
      }
    });
    this.stompClient.subscribe('/participant/login', (msg) => {
      if (msg.body) {
        this.loginMessage.next(JSON.parse(msg.body));
      }
    });
    this.stompClient.subscribe('/participant/logout', (msg) => {
      if (msg.body) {
        this.logoutMessage.next(JSON.parse(msg.body));
      }
    });
    this.stompClient.subscribe('/participant/update', msg => {
      if (msg.body) {
        this.participantUpdate.next(JSON.parse(msg.body));
      }
    });
  }

  sendMessage(msg: string) {
    this.stompClient.send('/app/send/message' , {}, msg);
  }

  notifyParticipantUpdate(chatParticipant: ChatParticipant) {
    console.log('Sending udate');
    console.log(chatParticipant);
    this.stompClient.send('/app/participant/update', {}, JSON.stringify(chatParticipant));
  }

  get sessionId(): string {
    return this._sessionId;
  }
}
