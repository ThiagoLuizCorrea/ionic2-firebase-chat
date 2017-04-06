import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import 'rxjs/add/operator/first';

import { AuthService } from './../../providers/auth.service';
import { User } from './../../models/user.model';
import { UserService } from './../../providers/user.service';

@Component({
  selector: 'user-info',
  templateUrl: 'user-info.html'
})
export class UserInfoComponent implements OnInit {

  @Input() user: User;
  @Input() isMenu: boolean = false;
  @Output() userChange: EventEmitter<User> = new EventEmitter<User>();

  constructor(
    public authService: AuthService,
    public userService: UserService
  ) { }

  ngOnInit() {  

    /*this.authService
      .auth
      .subscribe((authState: FirebaseAuthState) => {
        if (authState) {
          this.userService.currentUser
            .subscribe((user: User) => {
              this.user = user;
            });
        }
      });*/

  }

}
