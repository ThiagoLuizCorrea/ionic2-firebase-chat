import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { BehaviorSubject, Observable } from 'rxjs';

import { AngularFire, FirebaseListObservable } from 'angularfire2';

import { Message } from './../models/message.model';

@Injectable()
export class MessagesService {

  private node: string = 'messages';
  private limit: BehaviorSubject<number> = new BehaviorSubject<number>(25);

  constructor(
    public af: AngularFire,
    public http: Http
  ) {}

  getLimit(): BehaviorSubject<number> {
    return this.limit;
  }

  incrementLimit(): Observable<boolean> {    
    this.limit.next(this.limit.getValue() + 10);
    return Observable.of<boolean>(true);
  }

  getMessages(userId1: string, userId2: string): FirebaseListObservable<Message[]> {       
    return this.af.database.list(`/${this.node}/${userId1}-${userId2}`, {
      query: {
        orderByChild: 'timestamp',
        limitToLast: this.limit
      }
    });
  }

  getMessagesLimitToFirst(uid: string, limit?: number): FirebaseListObservable<Message[]> {
    return this.af.database.list(`/${this.node}/${uid}`, {
      query: {
        limitToFirst: limit || 1
      }
    });
  }

}
