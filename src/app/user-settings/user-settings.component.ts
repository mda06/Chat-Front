import { Component, OnInit } from '@angular/core';
import {ChatService} from '../service/chat.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit {

  username = 'Visitor';
  constructor(private chatService: ChatService) { }

  ngOnInit() {
  }

  onUsernameChanged() {
    this.chatService.notifyParticipantUpdate({sessionId: this.chatService.sessionId, username: this.username});
  }
}
