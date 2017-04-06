import { Inject, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Observable } from 'rxjs';

import { AngularFire, FirebaseApp, FirebaseListObservable, FirebaseObjectObservable, FirebaseAuthState } from 'angularfire2';

import { BaseService } from './base-service';
import { User } from './../models/user.model';

@Injectable()
export class UserService extends BaseService {

  private node: string = 'users';
  private users: FirebaseListObservable<User[]>;
  currentUser: FirebaseObjectObservable<User>;
  currentUserSync: User;

  constructor(
    public af: AngularFire,
    @Inject(FirebaseApp) public firebaseApp: any,
    public http: Http
  ) {
    super();
    this.listenAuthState();
  }

  listenAuthState(): void {
    this.af.auth
      .subscribe((authState: FirebaseAuthState) => {
        if (authState) {
          this.currentUser = this.af.database.object(`/${this.node}/${authState.auth.uid}`);
          this.currentUser.subscribe(user => this.currentUserSync = user);
        }
      });
  }

  userExists(username: string): Observable<boolean> {
    return this.af.database.list(`/${this.node}`, {
      query: {
        orderByChild: 'username',
        equalTo: username
      }
    }).map((users: User[]) => {
      return users.length > 0;
    });
  }

  createAccount(user): firebase.Promise<any> {
    delete user.password;
    return this.af.database.object(`/${this.node}/${user.uid}`)
      .set(user)
      .catch(this.handlePromiseError);
  }

  editUser(newUser: { name: string, username: string, photo: string }): firebase.Promise<void> {
    return this.currentUser.update(newUser);
  }

  uploadPhoto(file: File): firebase.storage.UploadTask {

    return this.firebaseApp
      .storage()
      .ref()
      .child(`/${this.node}/${this.currentUserSync.uid}`)
      .put(file);

    /*let uploadTask = this.firebaseApp
        .storage()
        .ref()
        .child(`/${this.node}/${this.currentUserSync.uid}`)
        .put(file);

    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed', (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        console.log(snapshot);        
      }, (error) => {
        this.handlePromiseError(error);
      }, () => {
        resolve(uploadTask.snapshot.downloadURL);
      });

    });*/
  }

  getUser(userId: string): FirebaseObjectObservable<User> {
    return this.af.database.object(`/${this.node}/${userId}`);
  }

  getUsers(excludeCurrentUser?: boolean): FirebaseListObservable<User[]> {
    if (this.users) {
      return this.users;
    }

    if (excludeCurrentUser) {
      return <FirebaseListObservable<any>>this.af.database.list(`/${this.node}`, {
        query: {
          orderByChild: 'name'
        }
      }).map((users: User[]) => {
        return users.filter((user: User) => {
          return user.uid !== this.currentUserSync.uid
        });
      });
    }
    return this.af.database.list(`/${this.node}`);
  }

}
