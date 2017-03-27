import { Component, OnInit } from '@angular/core';

import { LoginService } from '../services/login.service';
import { ViewChild } from '@angular/core';
import { UserInfo } from '../classes/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  readonly TEXT_ERROR_INVALID_EMAIL = 'Enter a valid email';
  readonly TEXT_ERROR_PASSWORD = 'Password invalid (it should not be blank and matches with two fields)';
  readonly TEXT_PASSWORD_CHANGED = 'Pass was changed, congratulations!';
  readonly TEXT_OPEN_PROFILE_FORM = 'Edit profile';
  readonly TEXT_SUBMIT_PPROFILE_FORM = "Submit";
  readonly TEXT_CLOSE_PPROFILE_FORM = "Close";
  readonly TEXT_CHANGE_PASSWORD = "Change password";
  readonly TEXT_CHANGE_AVATAR = "Change avatar";
  readonly TEXT_CLOSE = "X";
  readonly TEXT_TITLE_MODAL_PASSWORD_HEADER = "Change Password";
  readonly TEXT_TITLE_MODAL_AVATAR_HEADER = "Change avatar";
  readonly TEXT_ACCOUNT_SETTINGS = "Accout Details";
  private userInfo: UserInfo;
  private password: string;
  private passwordValidate: string;
  private isProfileCollapse: boolean;
  private isPasswordModalCollapse: boolean;
  private isAvatarModalCollapse: boolean;

  constructor(private loginService: LoginService) { 
    this.userInfo = new UserInfo(-1, "", "", "", "", "", '');
    this.password = '';
    this.passwordValidate = '';
    this.isProfileCollapse = false;
    this.isPasswordModalCollapse = false;
    this.isAvatarModalCollapse = false;
  }

  ngOnInit() {
    this.getUserInfo();
  }

  private getUserInfo() {
    this.loginService.getFullUserInfo()
                     .subscribe(
                      (data) => { this.userInfo = data; }, 
                      (error) => { this.errorHandler(error) });
  }


  fileChange(event) {
      let fileList: FileList = event.target.files;
      if(fileList.length > 0) {
          let file: File = fileList[0];
          this.loginService.changeAvatar(file).subscribe(
            (data) => {this.getUserInfo(); this.closeModals();}, 
            (error) => {debugger});
      }
  }

  onClickEditForm() {
    this.isProfileCollapse = !this.isProfileCollapse;
    if (this.isProfileCollapse == false) {
      this.resetProfileForm();
    }
  }


  private errorHandler(error) {
    debugger;
  }

  private onClickPatchUserInfo() {
    if (!this.checkEmail(this.userInfo.email)) { alert(this.TEXT_ERROR_INVALID_EMAIL); return; }
    
    this.loginService.patchUserInfo(this.userInfo).subscribe(
      (data) => { 
        this.userInfo = data; 
        this.isProfileCollapse = !this.isPasswordValid;
      }, (error)=>{ debugger; });
  }

  private onClickChangePassword() {
    if (!this.isPasswordValid()) { alert(this.TEXT_ERROR_PASSWORD); return; }
    this.loginService.changePassword(this.password).subscribe(
                      (data) => {alert(this.TEXT_PASSWORD_CHANGED); this.isPasswordModalCollapse=false;}, 
                      (error) => {debugger;} );
  }

  private checkEmail(email: string) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  private isPasswordValid() {
    if (this.password === this.passwordValidate 
          && this.password.trim() !== '') { return true; }
    return false;
  }

  private resetProfileForm() {
    this.getUserInfo();
  }

  private onClickOpenPasswordModal() {
    if (!this.isPasswordModalCollapse) {
      this.closeModals();
      this.isPasswordModalCollapse = true;
      return;
    } 
    this.isPasswordModalCollapse = false;
  }

  private onClickOpenAvatarModal() {
    if (!this.isAvatarModalCollapse) {
      this.closeModals();
      this.isAvatarModalCollapse = true;
      return;
    } 
    this.isAvatarModalCollapse = false;
  }

  private closeModals() {
    this.isPasswordModalCollapse = false;
    this.isAvatarModalCollapse = false;
    this.emptyModalFields();
  }

  private emptyModalFields() {
    this.password = "";
    this.passwordValidate = "";
  }


}
