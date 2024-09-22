import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { take } from "rxjs/operators";
import { WebSocketService } from './services/web-socket.service';
import { RxStompService } from './services/rx-stomp.service';
import { Message } from '@stomp/stompjs';
import { ChatMessage, MessageType } from './models/chat-message';
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

  constructor(private webSocketService: WebSocketService, private rxStompService: RxStompService,
    private sockJsService: SockJsService
  ){}

  ngOnInit(): void {
    
    this.sockJsService.connect()

    this.sockJsService.websocketMessage.subscribe(message => {
      console.log(message)
    })

    // this.topicSubscription = this.rxStompService
    //   .watch('/topic/public')
    //   .subscribe((message: Message) => {
    //     if(message.body) {
    //       this.receivedMessages.push(JSON.parse(message.body));
    //     }
    //   });

    
    // this.webSocketService.openWebSocket()
    // timer(5000).pipe(
    //   take(1)
    // ).subscribe(value => this.webSocketService.sendMessage())
  }

  ngOnDestroy(): void {

    this.sockJsService.disconnect()
      
    // this.topicSubscription.unsubscribe();

      // console.log('destroyed')
      // this.webSocketService.closeWebSocket();
  }

  onSendMessage() {

    this.sockJsService.sendMessage()

    // let chatMessage: ChatMessage = {
    //   content: "message content",
    //   sender: "shree",
    //   type: MessageType.CHAT
    // };
    // this.rxStompService.publish({ destination: '/topic/public', body: JSON.stringify(chatMessage) });
  }
  
}
