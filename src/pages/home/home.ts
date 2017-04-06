import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, MenuController } from 'ionic-angular';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

import { AngularFire, FirebaseListObservable } from 'angularfire2';

import { AuthService } from './../../providers/auth.service';
import { ChatPage } from './../chat/chat';
import { ChatsService } from './../../providers/chats.service';
import { User } from './../../models/user.model';
import { UserService } from './../../providers/user.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [ChatsService]
})
export class HomePage {

  view: string = 'chats';
  chats: FirebaseListObservable<any>;
  users: FirebaseListObservable<any>;

  constructor(
    public alertCtrl: AlertController,
    public af: AngularFire,
    public authService: AuthService,
    public chatsService: ChatsService,
    public loadingCtrl: LoadingController,
    public menuCtrl: MenuController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public userService: UserService
  ) {}

  ionViewCanEnter(): Promise<boolean> {
    return this.authService.authenticated;
  }

  ionViewDidLoad() {

    this.menuCtrl.enable(true, 'user-menu');

    let loading = this.loadingCtrl.create({
      content: 'Loading data...'
    });
    loading.present();

    this.userService.currentUser
      .take(1)
      .subscribe((currentUser: User) => {

        this.chats = this.chatsService.getChats(currentUser.uid, true);

        this.chats
          .take(1)
          .subscribe((chats) => {
            loading.dismiss();
          });

        this.users = this.userService.getUsers(true);

      });
  }

  filterItems(event: any, currentView: string): void {
    let searchTerm: string = event.target.value;

    this.chats = this.chatsService.getChats(this.userService.currentUserSync.uid, true);
    this.users = this.userService.getUsers(true);

    if (searchTerm) {
      switch (currentView) {
        case 'chats':
          this.chats
            .take(1)
            .subscribe((chats) => {
              this.chats = <FirebaseListObservable<any>>this.chats
                .map(chats => {
                  return chats.filter((chat) => {
                    return (chat.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
                  });
                });
            });
          break;
        case 'users':
          this.users
            .take(1)
            .subscribe((users: User[]) => {
              this.users = <FirebaseListObservable<any>>this.users
                .map((users: User[]) => {
                  return users
                    .filter((user: User) => {
                      return (user.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
                    });
                });
            });
          break;
      }
    }

  }

  onChatCreate(otherUser): void {

    this.userService.currentUser
      .take(1)
      .subscribe((currentUser: User) => {

        this.chatsService.getDeepChat(otherUser.uid, currentUser.uid)
          .subscribe(chat => {

            // se não houver chats criados
            if (chat.hasOwnProperty('$value')) {

              let timestamp: number = Date.now();

              this.userService.currentUser
                .subscribe((currentUser: User) => {

                  // of currentUser to otherUser
                  let chat1 = {
                    title: otherUser.name,
                    lastMessage: '',
                    timestamp: timestamp,
                    uid: otherUser.uid
                  }
                  this.chatsService.addChat(chat1, currentUser.uid, otherUser.uid);

                  // of otherUser to currentUser
                  let chat2 = {
                    title: currentUser.name,
                    lastMessage: '',
                    timestamp: timestamp,
                    uid: currentUser.uid
                  }
                  this.chatsService.addChat(chat2, otherUser.uid, currentUser.uid);

                });

            }
          });

      });

    this.navCtrl.push(ChatPage, {
      recipientUser: otherUser
    });

  }

  onChatOpen(chat): void {
    let recipientUserId = chat.$key;

    this.userService.getUser(recipientUserId)
      .take(1)
      .subscribe(user => {
        this.navCtrl.push(ChatPage, {
          recipientUser: user
        });
      });
  }

  ionViewDidLeave() {
    this.chats.subscribe().unsubscribe();
    this.users.subscribe().unsubscribe();
  }

}
