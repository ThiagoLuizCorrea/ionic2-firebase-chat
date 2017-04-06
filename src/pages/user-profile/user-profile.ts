import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { User } from './../../models/user.model';
import { UserService } from './../../providers/user.service';

@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html'
})
export class UserProfilePage {

  currentUser: User;
  canEdit: boolean = false;
  uploadProgress: number;
  private filePhoto: File;

  constructor(
    public cd: ChangeDetectorRef,
    public navCtrl: NavController,
    public navParams: NavParams,
    public userService: UserService
  ) { }

  ionViewDidLoad(): void {
    this.userService.currentUser
      .subscribe((user: User) => {
        this.currentUser = user;
      });
  }

  editProfile(): void {
    this.canEdit = !this.canEdit;
  }

  onSubmit(): void {

    if (this.filePhoto) {
      let uploadTask = this.userService.uploadPhoto(this.filePhoto);

      uploadTask.on('state_changed', (snapshot) => {

        this.uploadProgress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        this.cd.detectChanges();

      }, (error: Error) => {
        // catch error

      }, () => {
        this.editUser(uploadTask.snapshot.downloadURL);
      });
    } else {
      this.editUser();
    }
  }

  onPhoto(event): void {
    let file: File = event.target.files[0];
    this.filePhoto = file;
  }

  private editUser(photoUrl?: string): void {
    
    this.userService
      .editUser({
        name: this.currentUser.name,
        username: this.currentUser.username,
        photo: photoUrl || this.currentUser.photo
      })
      .then(() => {
        this.canEdit = false;
        this.uploadProgress = 0;
        this.filePhoto = undefined;
        this.cd.detectChanges();
      });
  }

}
