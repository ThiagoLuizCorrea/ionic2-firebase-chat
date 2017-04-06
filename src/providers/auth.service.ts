import { BaseService } from './base-service';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

import { Observable } from 'rxjs';

import { AngularFireAuth, AuthMethods, AuthProviders, FirebaseAuthState } from 'angularfire2';

@Injectable()
export class AuthService extends BaseService {

  constructor(
    public http: Http,
    public auth: AngularFireAuth
  ) {
    super();
  }

  signinWithEmail(user: {}): Promise<boolean> {
    return <Promise<boolean>>this.auth.login(user)
      .then((authState: FirebaseAuthState) => {
        return this.authenticated;
      }).catch(this.handleError);
  }

  signinWithFacebook(): firebase.Promise<FirebaseAuthState> {
    return this.auth.login({
      provider: AuthProviders.Facebook,
      method: AuthMethods.CustomToken
    });
  }

  createAuthUser(credentials): firebase.Promise<FirebaseAuthState> {
    return this.auth.createUser(credentials)
      .then((authState: FirebaseAuthState) => {
        return authState;
      }).catch(this.handlePromiseError);
  }

  logout(): Promise<void> {
    return this.auth.logout();
  }

  getAuthState(): Observable<FirebaseAuthState> {
    return this.auth;
  }

  get authenticated(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.auth
        .take(1)
        .subscribe((authState: FirebaseAuthState) => {        
          if (authState) {
            resolve(true);
          } else {
            reject(false);
          }
        });
    });
  }

  private handleError(err: any): Promise<any> {
    console.log('Error:', err); // somente para exemplo
    return Promise.reject(err.message || err);
  }

}
