import { Injectable } from '@angular/core';
import { ChatMessage, MessageType } from '../models/chat-message';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  webSocket: WebSocket;

  constructor() { }

  public openWebSocket() {
    this.webSocket = new WebSocket('ws://localhost:8080/ws');
    
    this.webSocket.onopen = event => {
      console.log('on-open', event)
    }
    this.webSocket.onmessage = event => {
      console.log('on-message', event)
    }
    this.webSocket.onerror = event => {
      console.log('on-error', event)
    }
  }

  public sendMessage() {
    let chatMessage: ChatMessage = {
      content: "message content",
      sender: "shree",
      type: MessageType.CHAT
    }
    this.webSocket.send(JSON.stringify(chatMessage))
  }

  public closeWebSocket() {
    this.webSocket.close()
  }
}
