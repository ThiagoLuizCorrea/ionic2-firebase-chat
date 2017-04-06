import { OnInit } from '@angular/core';
import { AlertController, App, NavController, MenuController } from 'ionic-angular';

import { AuthService } from './../providers/auth.service';
import { SigninPage } from './../pages/signin/signin';

export class BaseComponent implements OnInit {

    protected navCtrl: NavController;

    constructor(
        public alertCtrl: AlertController,
        public authService: AuthService,
        public app: App,
        public menuCtrl: MenuController
    ) {
    }

    ngOnInit(): void {
        this.navCtrl = this.app.getActiveNav();
    }

    onLogout(): void {
        this.alertCtrl.create({
            message: 'Do you want to quit?',
            buttons: [
                {
                    text: 'Yes',
                    handler: () => {
                        this.authService.logout();
                        this.menuCtrl.enable(false, 'user-menu');
                        this.navCtrl.setRoot(SigninPage);
                    }
                },
                {
                    text: 'No'
                }
            ]
        }).present();
    }

}