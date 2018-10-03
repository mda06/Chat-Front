import {Component, Input, OnInit} from '@angular/core';
import {ChatParticipant} from '../dto/chat-participant';
import {ChatService} from '../service/chat.service';

@Component({
  selector: 'app-participant',
  templateUrl: './participant.component.html',
  styleUrls: ['./participant.component.css']
})
export class ParticipantComponent implements OnInit {

  private participants: Array<ChatParticipant> = [];
  constructor(private chatService: ChatService) { }

  ngOnInit() {
    this.chatService.loginMessage$.subscribe(participant => {
      this.participants.push(participant);
    });
    this.chatService.logoutMessage$.subscribe(participant => {
      const participantInList = this.participants.find(p => p.sessionId === participant.sessionId);
      const index = this.participants.indexOf(participantInList);
      this.participants.splice(index, 1);
    });
    this.chatService.participants$.subscribe(participants => {
      this.participants = participants;
    });
    this.chatService.participantUpdate$.subscribe(participant => {
      const participantInList = this.participants.find(p => p.sessionId === participant.sessionId);
      participantInList.username = participant.username;
    });
  }

  isItMe(participant: ChatParticipant): boolean {
    return participant.sessionId === this.chatService.sessionId;
  }
}
