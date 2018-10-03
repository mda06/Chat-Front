import { Component } from '@angular/core';
import {ChatService} from './service/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private messageToSend = '';
  private messages: Array<string> = [];

  constructor(private chatService: ChatService) {
    this.initChat();
  }

  initChat() {
    this.chatService.connect();
    this.chatService.receivedMessage$.subscribe(msg => {
      this.messages.push(msg);
    });
    this.chatService.loginMessage$.subscribe(participant => {
      console.log(participant);
    });
    this.chatService.logoutMessage$.subscribe(participant => {
      console.log(participant);
    });
    this.chatService.participants$.subscribe(participants => {
      console.log(participants);
    });
    this.chatService.participantUpdate$.subscribe(participant => console.log(participant));
  }

  onSendMessage() {
    this.chatService.sendMessage(this.messageToSend);
    this.messageToSend = '';
  }
}
