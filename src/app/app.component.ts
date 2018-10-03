import { Component } from '@angular/core';
import {ChatService} from './service/chat.service';
import {ChatMessage} from './dto/chat-message';
import {ChatParticipant} from './dto/chat-participant';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public chatService: ChatService) {
    this.chatService.connect();
  }
}
