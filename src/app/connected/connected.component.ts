import { Component, OnInit } from '@angular/core';
import {ChatMessage} from '../dto/chat-message';
import {ChatParticipant} from '../dto/chat-participant';
import {ChatService} from '../service/chat.service';

@Component({
  selector: 'app-connected',
  templateUrl: './connected.component.html',
  styleUrls: ['./connected.component.css']
})
export class ConnectedComponent {
  private messageToSend = '';
  private messages: Array<ChatMessage> = [];
  private participants: Array<ChatParticipant> = [];

  constructor(private chatService: ChatService) {
    this.initChat();
  }

  initChat() {
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
