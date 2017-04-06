import { Teste } from './../teste/teste';
import { Component } from '@angular/core';
import { AlertController, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { AuthService } from './../../providers/auth.service';
import { HomePage } from './../home/home';
import { SignupPage } from './../signup/signup';
import { UserService } from './../../providers/user.service';

@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html'
})
export class SigninPage {

  signinForm: FormGroup;

  constructor(
    private authService: AuthService,
    private alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public userService: UserService
  ) {
    let emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    this.signinForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    let loading: Loading = this.showLoading();
    this.authService.signinWithEmail(this.signinForm.value)
      .then((isLogged: boolean) => {
        if (isLogged) {
          this.navCtrl.setRoot(HomePage);
          loading.dismiss();
        }
      }).catch(error => {
        console.log(error);
        loading.dismiss();
        this.showAlert(error);
      });
  }

  loginFacebook(): void {
    this.authService.signinWithFacebook();
  }

  gotoSignup(): void {
    this.navCtrl.push(SignupPage);
  }

  gotoHome(): void {
    this.navCtrl.push(HomePage)
      .catch(err => {
        console.log('Acesso não permitido', err);
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
