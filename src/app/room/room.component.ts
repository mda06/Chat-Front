import {Component, Input, OnInit} from '@angular/core';
import {Room} from '../dto/room';
import {ChatService} from '../service/chat.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  @Input() room: Room;
  constructor(private chatService: ChatService) { }

  ngOnInit() {
    this.chatService.subscribeToRoom(this.room.id).subscribe(msg => {
      console.log('Message comming to the room ', this.room.name, ': ', msg);
    });
  }

}
