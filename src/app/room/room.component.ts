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
  constructor(private chatService: ChatService) { }

  ngOnInit() {
    console.log('Init');
  }

  @Input()
  set room(room: Room) {
    this._room = room;
    this.chatService.subscribeToRoom(this._room.id).subscribe(msg => {
      console.log('Message comming to the room ', this._room.name, ': ', msg);
    });
  }

  get room(): Room {
    return this._room;
  }

}
