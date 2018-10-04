import {Component, Input, OnInit} from '@angular/core';
import {Room} from '../dto/room';
import {ChatService} from '../service/chat.service';
@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  private _room: Room;
  private messageToSend = '';
  constructor(private chatService: ChatService) { }

  ngOnInit() {
  }

  @Input()
  set room(room: Room) {
    this._room = room;
    console.log('Setting the room.');
    this.chatService.subscribeToRoom(this._room.id, msg => {
      if (msg.body) {
        this._room.messages.push(JSON.parse(msg.body));
      }
    });
  }

  onSendMessage() {
    this.chatService.sendMessageToRoom(this.messageToSend, this._room.id);
    this.messageToSend = '';
  }

  get room(): Room {
    return this._room;
  }
}
