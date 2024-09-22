import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import { ChatMessage } from '../models/chat-message';

@Injectable({
  providedIn: 'root'
})
export class SockJsService {

  private stompClient: Stomp.Client;
  private subscriptions: Subscription[] = [];
  public websocketMessage: Subject<any> = new Subject<any>();
  private isConnected: Subject<boolean> = new Subject<boolean>();

  constructor() { }

  public getIsConnected() :Subject<boolean> {
    return this.isConnected
  }

  public connect(userName: string) {
    const serverUrl = 'http://localhost:4200/web-socket/ws';
    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(ws);
    this.stompClient.connect({userName}, (frame) => this.successCallback(), ((error) => this.errorCallback(error, userName)))
  }

  private errorCallback(error, userName) {
    console.log('stomp connection error', error);
    setTimeout(() => {
      console.log('stomp reconnecting websocket')
      this.connect(userName);
    }, 10000);
  }

  private successCallback() {
    this.isConnected.next(true)
    this.subscriptions.push(this.stompClient.subscribe('/topic/public', ((message: Stomp.Frame) => {
      this.websocketMessage.next(message)
    })))

  }

  public sendMessage(destination: string, chatMessage: ChatMessage) {
    this.stompClient.send(destination, {}, JSON.stringify(chatMessage))
  }

  public disconnect() {
    if (this.stompClient !== null) {
      try {
        this.isConnected.next(false)
        this.stompClient.disconnect(()=>{
          console.log("stomp client disconnected");
        });
        this.subscriptions.forEach((sub) => sub.unsubscribe());
      } catch (e) {
        console.error(e);
      }
    }
  }

}
