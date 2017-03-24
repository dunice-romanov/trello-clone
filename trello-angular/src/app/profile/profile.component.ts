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
  private userInfo: UserInfo;
  private password: string;
  private passwordValidate: string;

  constructor(private loginService: LoginService) { 
    this.userInfo = new UserInfo(-1, "", "", "", "", "", '');
    this.password = '';
    this.passwordValidate = '';
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
          this.loginService.changeAvatar(file).subscribe((data) => {this.getUserInfo()}, (error) => {debugger});
      }
  }


  private errorHandler(error) {
    debugger;
  }

  private onClickPatchUserInfo() {
    if (!this.checkEmail(this.userInfo.email)) { alert(this.TEXT_ERROR_INVALID_EMAIL); return; }
    
    this.loginService.patchUserInfo(this.userInfo).subscribe((data) => { this.userInfo = data; }, (error)=>{ debugger; });
  }

  private onClickChangePassword() {
    if (!this.isPasswordValid()) { alert(this.TEXT_ERROR_PASSWORD); return; }
    this.loginService.changePassword(this.password).subscribe(
                      (data) => {alert(this.TEXT_PASSWORD_CHANGED)}, 
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

}
