import {Component, Input, OnInit} from '@angular/core';
import {Room} from '../dto/room';
import {ChatService} from '../service/chat.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  private _room: Room;
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

  get room(): Room {
    return this._room;
  }

}
