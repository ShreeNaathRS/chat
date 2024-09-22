import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { ChatMessage } from './models/chat-message';
import { SockJsService } from './services/sock-js.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{
  
  title = 'chat';
  receivedMessages: ChatMessage[] = [];
  topicSubscription: Subscription;

  constructor(private sockJsService: SockJsService){}

  ngOnInit(): void {
    
    this.sockJsService.connect()
    this.sockJsService.websocketMessage.subscribe(message => {
      if(message.body){
        let chatMessage: ChatMessage = JSON.parse(message.body)
        console.log(chatMessage)
      }
    })
  }

  ngOnDestroy(): void {
    this.sockJsService.disconnect()
  }

  onSendMessage() {
    this.sockJsService.sendMessage()
  }
  
}
