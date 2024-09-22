import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChatMessage, MessageType } from 'src/app/models/chat-message';
import { SockJsService } from 'src/app/services/sock-js.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  
  title = 'chat';
  receivedMessages: ChatMessage[] = [];
  topicSubscription: Subscription;
  entryForm: FormGroup;
  messageForm: FormGroup;
  isConnected: boolean = false;

  constructor(private sockJsService: SockJsService, private fb: FormBuilder){
    this.entryForm = fb.group({
      name: new FormControl('', [Validators.required, Validators.minLength(5)])
    })
    this.messageForm = fb.group({
      message: new FormControl('', [Validators.required])
    })
    this.sockJsService.getIsConnected().subscribe(value => this.isConnected = value)
  }

  enterChatRoom() {
    if(this.entryForm.valid) {
      this.sockJsService.connect(this.entryForm.controls['name'].value)
    }
  }

  ngOnInit(): void {
    this.topicSubscription = this.sockJsService.websocketMessage.subscribe(message => {
      if(message.body){
        let chatMessage: ChatMessage = JSON.parse(message.body)
        this.receivedMessages.push(chatMessage)
      }
    })
  }

  ngOnDestroy(): void {
    this.sockJsService.disconnect()
    this.topicSubscription.unsubscribe()
  }

  sendMessage() {
    this.entryForm.markAllAsTouched()
    const chatMessage: ChatMessage = {
      content: this.messageForm.controls['message'].value,
      sender: this.entryForm.controls['name'].value,
      type: MessageType.CHAT
    }
    if(this.entryForm.valid && this.messageForm.valid) {
      this.sockJsService.sendMessage('/app/chat/send', chatMessage)
      this.messageForm.controls['message'].setValue(null)
      this.messageForm.controls['message'].setErrors({'required': false})
      this.messageForm.reset()
    }
  }

  disconnect() {
    this.sockJsService.disconnect()
  }

  leaveChatRoom() {
    const leaveMessage: ChatMessage = {
      content: '',
      sender: this.entryForm.controls['name'].value,
      type: MessageType.LEAVE
    }
    this.sockJsService.sendMessage('/app/chat/send', leaveMessage)
    this.disconnect()
  }
  
}
