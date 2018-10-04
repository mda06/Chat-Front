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
  private roomToSend = 1;
  private messages: Array<ChatMessage> = [];
  private rooms: Array<Room> = [];
  private selectedRoom: Room;

  constructor(private chatService: ChatService) {
    this.initChat();
  }

  initChat() {
    this.chatService.receivedMessage$.subscribe(msg => {
      this.messages.push(msg);
    });
    this.chatService.rooms$.subscribe(rooms => {
      this.rooms = rooms;
    });
  }

  onSendMessage() {
    // this.chatService.sendMessage(this.messageToSend);
    this.chatService.sendMessageToRoom(this.messageToSend, this.roomToSend);
    this.messageToSend = '';
  }

  onRoomSelected(room: Room) {
    this.selectedRoom = room;
  }
}
