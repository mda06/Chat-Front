import {Component, Input, OnInit} from '@angular/core';
import {ChatParticipant} from '../dto/chat-participant';

@Component({
  selector: 'app-participant',
  templateUrl: './participant.component.html',
  styleUrls: ['./participant.component.css']
})
export class ParticipantComponent implements OnInit {

  @Input() participant: ChatParticipant;
  constructor() { }

  ngOnInit() {
  }

}
