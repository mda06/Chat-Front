import { Component, OnInit } from '@angular/core';
import {ChatMessage} from '../dto/chat-message';
import {ChatParticipant} from '../dto/chat-participant';
import {ChatService} from '../service/chat.service';
import {Room} from '../dto/room';

@Component({
  selector: 'app-connected',
  templateUrl: './connected.component.html',
  styleUrls: ['./connected.component.css']
})
export class ConnectedComponent {
  private messageToSend = '';
  private messages: Array<ChatMessage> = [];
  private rooms: Array<Room> = [];
  private selectedRoom: Room;

  constructor(private chatService: ChatService) {
    this.initChat();
  }

  initChat() {
    this.selectedRoom = {id: 13, name: 'General', messages: []};
    this.chatService.receivedMessage$.subscribe(msg => {
      this.messages.push(msg);
    });
  }

  onSendMessage() {
    this.chatService.sendMessage(this.messageToSend);
    this.messageToSend = '';
  }

}
