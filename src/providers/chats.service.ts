import { BaseService } from './base-service';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';

import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { Chat } from './../models/chat.model';

@Injectable()
export class ChatsService extends BaseService {

  private node: string = 'chats';
  private chats: FirebaseListObservable<Chat[]>;

  constructor(
    public af: AngularFire,
    public http: Http
  ) {
    super();
  }

  addChat(chat: Chat, userId1: string, userId2: string): firebase.Promise<boolean> {
    return this.af.database.object(`/${this.node}/${userId1}/${userId2}`)
      .set(chat)
      .then(() => {
        return true;
      }).catch(this.handlePromiseError);
  }

  getChat(userId: string): FirebaseObjectObservable<any> {
    return <FirebaseObjectObservable<any>>this.af.database.object(`/${this.node}/${userId}`)
      .catch(this.handleObservableError);
  }

  getDeepChat(userId1: string, userId2: string): FirebaseObjectObservable<any> {
    return <FirebaseObjectObservable<any>>this.af.database.object(`/${this.node}/${userId1}/${userId2}`)
      .catch(this.handleObservableError);
  }

  getChats(userId: string, filter?: boolean): FirebaseListObservable<any> {
    if (this.chats) {
      return this.chats;
    }

    this.chats = <FirebaseListObservable<any>>this.af.database.list(`/${this.node}/${userId}`, {
      query: {
        orderByChild: 'timestamp'
      }
    }).map((chats: Chat[]) => {
      return chats.reverse();
    }).catch(this.handleObservableError);

    if (filter) {
      return <FirebaseListObservable<any>>this.chats
        .map((chats: Chat[]) => {
          return chats.filter((chat: Chat) => {
            return chat[Object.keys(chat)[0]].uid !== userId
          });
        });
    }
    return this.chats;
  }

}
