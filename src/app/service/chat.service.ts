import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {ChatParticipant} from '../dto/chat-participant';
import {ChatMessage} from '../dto/chat-message';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {Room} from '../dto/room';

@Injectable()
export class ChatService {
  // Basic vars
  private serverUrl = 'http://localhost:8080/socket';
  private stompClient;
  private _sessionId: string;
  // Events
  private receivedMessage = new ReplaySubject<ChatMessage>();
  receivedMessage$ = this.receivedMessage.asObservable();
  private loginMessage = new ReplaySubject<ChatParticipant>();
  loginMessage$ = this.loginMessage.asObservable();
  private logoutMessage = new ReplaySubject<ChatParticipant>();
  logoutMessage$ = this.logoutMessage.asObservable();
  private participants = new ReplaySubject<Array<ChatParticipant>>();
  participants$ = this.participants.asObservable();
  private participantUpdate = new ReplaySubject<ChatParticipant>();
  participantUpdate$ = this.participantUpdate.asObservable();
  private rooms = new ReplaySubject<Array<Room>>();
  rooms$ = this.rooms.asObservable();
  private roomAdded = new ReplaySubject<Room>();
  roomAdded$ = this.roomAdded.asObservable();

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
      that.initRooms();
    });
  }

  // See SendMessage
  private initReceivedMessages() {
    this.stompClient.subscribe('/chat', (msg) => {
      if (msg.body) {
        this.receivedMessage.next(JSON.parse(msg.body));
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

  private initRooms() {
    this.stompClient.subscribe('/app/room/all', msg => {
      if (msg.body) {
        this.rooms.next(JSON.parse(msg.body));
      }
    });
    this.stompClient.subscribe('/room/created', msg => {
      if (msg.body) {
        this.roomAdded.next(JSON.parse(msg.body));
      }
    });
  }

  subscribeToRoom(roomId: number, callback) {
    this.stompClient.subscribe('/room/receive/' + roomId, callback);
  }

  sendMessageToRoom(msg: string, roomId: number) {
    this.stompClient.send('/app/room/send/' + roomId, {}, msg);
  }

  addNewRoom(roomName: string) {
    this.stompClient.send('/app/room/add', {}, roomName);
  }

  // Not used, maybe can be used for a general messages?
  sendMessage(msg: string) {
    this.stompClient.send('/app/send/message' , {}, msg);
  }

  notifyParticipantUpdate(chatParticipant: ChatParticipant) {
    this.stompClient.send('/app/participant/update', {}, JSON.stringify(chatParticipant));
  }

  isConnected(): boolean {
    return this.stompClient != null && this.stompClient.connected;
  }

  get sessionId(): string {
    return this._sessionId;
  }
}
