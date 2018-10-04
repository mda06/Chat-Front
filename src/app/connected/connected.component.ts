import { Component, OnInit } from '@angular/core';
import {ChatMessage} from '../dto/chat-message';
import {ChatParticipant} from '../dto/chat-participant';
import {ChatService} from '../service/chat.service';
import {Room} from '../dto/room';
import {isNullOrUndefined} from 'util';

@Component({
  selector: 'app-connected',
  templateUrl: './connected.component.html',
  styleUrls: ['./connected.component.css']
})
export class ConnectedComponent {
  private rooms: Array<Room> = [];
  private selectedRoom: Room;

  constructor(private chatService: ChatService) {
    this.initChat();
  }

  initChat() {
    this.chatService.rooms$.subscribe(rooms => {
      this.rooms = rooms;
      this.rooms.forEach(room => {
        this.chatService.subscribeToRoom(room.id, msg => {
          if (msg.body) {
            room.messages.push(JSON.parse(msg.body));
          }
        });
      });
    });
  }

  onRoomSelected(room: Room) {
    this.selectedRoom = room;
  }

  isActiveRoom(room: Room): boolean {
    if (isNullOrUndefined(this.selectedRoom)) {
      return false;
    }
    return this.selectedRoom.id === room.id;
  }
}
