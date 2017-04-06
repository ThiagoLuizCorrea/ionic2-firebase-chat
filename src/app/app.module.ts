import { ProgressBarComponent } from './../components/progress-bar/progress-bar';
import { UserInfoComponent } from './../components/user-info/user-info';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { AngularFireModule, AuthMethods, AuthProviders, FirebaseAppConfig } from 'angularfire2';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AuthService } from './../providers/auth.service';
import { CapitalizePipe } from './../pipes/capitalize.pipe';
import { ChatBoxComponent } from './../components/chat-box/chat-box';
import { ChatPage } from './../pages/chat/chat';
import { ChatsService } from './../providers/chats.service';
import { CustomLoggedHeaderComponent } from './../components/custom-logged-header/custom-logged-header';
import { DecryptUserPipe } from './../pipes/decrypt-user.pipe';
import { UserService } from './../providers/user.service';
import { CustomHeaderComponent } from './../components/custom-header/custom-header';
import { HomePage } from './../pages/home/home';
import { MessagesService } from './../providers/messages.service';
import { MyApp } from './app.component';
import { SigninPage } from './../pages/signin/signin';
import { SignupPage } from './../pages/signup/signup';
import { UserMenuComponent } from './../components/user-menu/user-menu';
import { UserProfilePage } from './../pages/user-profile/user-profile';

const firebaseAppConfig: FirebaseAppConfig = {
  apiKey: "AIzaSyCZ6Yqgd5KcRVDT7DrMZ-Atk_TFNzenlBs",
  authDomain: "chat-example-1c403.firebaseapp.com",
  databaseURL: "https://chat-example-1c403.firebaseio.com",
  storageBucket: "chat-example-1c403.appspot.com",
  messagingSenderId: "550642140482"
};

const firebaseAuthConfig = {
  provider: AuthProviders.Custom,
  method: AuthMethods.Password
}

@NgModule({
  declarations: [
    CapitalizePipe,
    ChatBoxComponent,
    ChatPage,
    CustomHeaderComponent,
    CustomLoggedHeaderComponent,
    DecryptUserPipe,
    HomePage,
    MyApp,
    ProgressBarComponent,
    SigninPage,
    SignupPage,
    UserInfoComponent,
    UserMenuComponent,
    UserProfilePage
  ],
  imports: [
    AngularFireModule.initializeApp(firebaseAppConfig, firebaseAuthConfig, 'custom-app-name'),
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      preloadModules: true
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ChatPage,
    MyApp,
    HomePage,
    SigninPage,
    SignupPage,
    UserProfilePage
  ],
  providers: [
    AuthService,
    ChatsService,
    DecryptUserPipe,
    MessagesService,
    StatusBar,
    SplashScreen,
    UserService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
