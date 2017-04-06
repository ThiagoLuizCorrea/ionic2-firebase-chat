import { Component, ViewChild } from '@angular/core';
import { Content, NavController, NavParams } from 'ionic-angular';

import 'rxjs/add/operator/take';
import { Observable, Observer, Subscription } from 'rxjs';

import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import firebase from 'firebase';

import { ChatsService } from './../../providers/chats.service';
import { MessagesService } from './../../providers/messages.service';
import { User } from './../../models/user.model';
import { UserService } from './../../providers/user.service';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})
export class ChatPage {

  @ViewChild(Content) content: Content;
  messages: FirebaseListObservable<any>;
  pageTitle: string;
  sender: User;
  recipientUser: User;
  private chat1: FirebaseObjectObservable<any>;
  private chat2: FirebaseObjectObservable<any>;
  private subscribedMessages: Subscription;
  private lastLocalMessageKey: string;
  private lastServerMessageKey: string;
  private messageKeyUserId: string;

  constructor(
    public af: AngularFire,
    public chatsService: ChatsService,
    public messagesService: MessagesService,
    public navCtrl: NavController,
    public navParams: NavParams,
    public userService: UserService
  ) { }

  ionViewDidEnter() {
    this.scrollToBottom(0);
  }

  ionViewDidLoad() {

    // set class attributes
    this.recipientUser = this.navParams.get('recipientUser');
    this.pageTitle = this.recipientUser.name;

    // set sender user
    this.userService.currentUser
      .subscribe((currentUser: User) => {
        this.sender = currentUser;

        // get individual chats
        // chat1
        this.chat1 = this.chatsService.getDeepChat(this.sender.uid, this.recipientUser.uid);

        // chat2
        this.chat2 = this.chatsService.getDeepChat(this.recipientUser.uid, this.sender.uid);

        // do subscription to scroll bottom
        let doSubscription = () => {
          this.subscribedMessages = this.messages
            .subscribe(messages => {
              this.scrollToBottom(0);
            });
        };

        // get messages list
        this.messages = this.messagesService
          .getMessages(this.sender.uid, this.recipientUser.uid);

        // verify is messages is empty
        this.messages
          .take(1)
          .subscribe(messages => {
            if (messages.length === 0) {
              this.messages = this.messagesService
                .getMessages(this.recipientUser.uid, this.sender.uid);

              this.messages
                .take(1)
                .subscribe(messages => {
                  doSubscription();
                });

            } else {
              doSubscription();
            }
          });

      });

  }

  private setLastServerMessageKey(): Observable<void> {
    return Observable.create((observer: Observer<any>) => {
      this.messagesService.getMessagesLimitToFirst(this.messageKeyUserId, 1)
        .take(1)
        .subscribe((messages) => {
          if (messages.length > 0) {
            this.lastServerMessageKey = messages[0].$key;
          }
          observer.next(0);
        });
    });
  }

  private scrollToBottom(duration?: number): void {
    setTimeout(() => {
      if (this.content) {
        this.content.scrollToBottom(duration || 300);
      }
    }, 50);
  }

  doInfinite(): Promise<any> {

    return new Promise((resolve, reject) => {

      let doOperation = () => {
        if (this.lastLocalMessageKey === this.lastServerMessageKey) {
          resolve();
        } else {
          this.messagesService
            .incrementLimit()
            .take(1)
            .subscribe((incremented) => {
              resolve();
            });
        }
      };

      if (!this.lastServerMessageKey) {
        this.setLastServerMessageKey()
          .take(1)
          .subscribe(() => {
            doOperation();
          });
      } else {
        doOperation();
      }
    });
  }

  sendMessage(newMessage: string): void {
    if (newMessage) {

      let currentTimestamp: Object = firebase.database.ServerValue.TIMESTAMP;      

      let promise = this.messages.push({
        sender: this.sender.name,
        text: newMessage,
        timestamp: currentTimestamp
      });

      promise.then(() => {

        this.scrollToBottom();

        this.chat1.update({
          lastMessage: newMessage,
          timestamp: currentTimestamp
        });

        this.chat2.update({
          lastMessage: newMessage,
          timestamp: currentTimestamp
        });

      });
    }
  }

  ionViewDidLeave() {
    if (this.subscribedMessages) this.subscribedMessages.unsubscribe();
    this.chat1.subscribe().unsubscribe();
    this.chat2.subscribe().unsubscribe();
  }

}
