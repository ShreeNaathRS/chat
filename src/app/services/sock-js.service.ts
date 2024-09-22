import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import { ChatMessage, MessageType } from '../models/chat-message';

@Injectable({
  providedIn: 'root'
})
export class SockJsService {

  private stompClient: Stomp.Client;
  private subscriptions: Subscription[] = [];
  public websocketMessage: Subject<any> = new Subject<any>();

  constructor() { }

  public connect() {
    const serverUrl = 'http://localhost:4200/web-socket/ws';
    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(ws);
    this.stompClient.connect({}, (frame) => this.successCallback(), ((error) => this.errorCallback(error)))
  }

  private errorCallback(error) {
    console.log('stomp connection error', error);
    setTimeout(() => {
      console.log('stomp reconnecting websocket')
      this.connect();
    }, 10000);
  }

  private successCallback() {
    this.subscriptions.push(this.stompClient.subscribe('/topic/public', ((message: Stomp.Frame) => {
      this.websocketMessage.next(message)
    })))

  }

  sendMessage() {
    const chatMessage: ChatMessage = {
      content: 'This is the main content sent through web socket',
      sender: 'R S Shree Naath',
      type: MessageType.CHAT
    }
    this.stompClient.send('/topic/public', {}, JSON.stringify(chatMessage))
  }

  public disconnect() {
    if (this.stompClient !== null) {
      try {
        this.stompClient.disconnect();
        this.subscriptions.forEach((sub) => sub.unsubscribe());
        console.log("stomp client disconnected");
      } catch (e) {
        console.error(e);
      }
    }
  }

}
