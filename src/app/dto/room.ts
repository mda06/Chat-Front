import {ChatMessage} from './chat-message';

export class Room {
  id = 0;
  name = '';
  messages: Array<ChatMessage> = [];
}
