import {Component, Input, OnInit} from '@angular/core';
import {Room} from '../dto/room';
import {ChatService} from '../service/chat.service';
import * as moment from 'moment';
@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  @Input()
  private room: Room;
  private messageToSend = '';
  constructor(private chatService: ChatService) { }

  ngOnInit() {
  }

  onSendMessage() {
    this.chatService.sendMessageToRoom(this.messageToSend, this.room.id);
    this.messageToSend = '';
  }

  formatTimestamp(timestamp: number): string {
    return moment(timestamp).format('DD/MM/YYYY hh:mm:ss');
  }
}
