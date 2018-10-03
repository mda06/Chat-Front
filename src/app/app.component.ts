import { Component } from '@angular/core';
import {ChatService} from './service/chat.service';
import {ChatMessage} from './dto/chat-message';
import {ChatParticipant} from './dto/chat-participant';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private messageToSend = '';
  private messages: Array<ChatMessage> = [];
  private participants: Array<ChatParticipant> = [];

  constructor(private chatService: ChatService) {
    this.initChat();
  }

  initChat() {
    this.chatService.connect();
    this.chatService.receivedMessage$.subscribe(msg => {
      this.messages.push(msg);
    });
    this.chatService.loginMessage$.subscribe(participant => {
      this.participants.push(participant);
    });
    this.chatService.logoutMessage$.subscribe(participant => {
      const participantInList = this.participants.find(p => p.sessionId === participant.sessionId);
      const index = this.participants.indexOf(participantInList);
      this.participants.splice(index, 1);
    });
    this.chatService.participants$.subscribe(participants => {
      this.participants = participants;
    });
    this.chatService.participantUpdate$.subscribe(participant => {
      const participantInList = this.participants.find(p => p.sessionId === participant.sessionId);
      participantInList.username = participant.username;
    });
  }

  onSendMessage() {
    this.chatService.sendMessage(this.messageToSend);
    this.messageToSend = '';
  }
}
