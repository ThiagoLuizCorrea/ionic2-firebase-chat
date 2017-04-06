import { Component } from '@angular/core';
import { Loading, LoadingController, NavController, NavParams, AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import 'rxjs/add/operator/take';

import { FirebaseAuthState } from 'angularfire2';

import { AuthService } from './../../providers/auth.service';
import { HomePage } from './../home/home';
import { UserService } from './../../providers/user.service';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

  signupForm: FormGroup;

  constructor(
    public alertCtrl: AlertController,
    public authService: AuthService,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public userService: UserService
  ) {
    let emailRegex = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    this.signupForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    let loading: Loading = this.showLoading();
    let username: string = this.signupForm.value.username;

    this.userService.userExists(username)
      .first()
      .subscribe((userExists: boolean) => {        

        if (!userExists) {

          this.authService.createAuthUser(this.signupForm.value)
            .then((authState: FirebaseAuthState) => {
              
              this.signupForm.value.uid = authState.auth.uid;

              this.userService.createAccount(this.signupForm.value)
                .then(() => {                  
                  this.navCtrl.setRoot(HomePage);
                  loading.dismiss();
                })

            }).catch((error: any) => {
              console.log(error);
              loading.dismiss();
              this.showAlert(error);
            });

        } else {
          
          this.alertCtrl.create({
            message: `O username '${username}' já está sendo usado por outro usuário!`,
            buttons: ['Ok']
          }).present();

          loading.dismiss();

        }

      });
  }

  private showLoading(): Loading {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    return loading;
  }

  private showAlert(message: string): void {
    this.alertCtrl.create({
      message: message,
      buttons: ['Ok']
    }).present();
  }

}
