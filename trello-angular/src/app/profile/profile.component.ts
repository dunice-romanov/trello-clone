import { Component, OnInit } from '@angular/core';

import { LoginService } from '../services/login.service';

import { UserInfo } from '../classes/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  private userInfo: UserInfo;


  constructor(private loginService: LoginService) { 
    this.userInfo = new UserInfo(-1, "", "", "", "", "");
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


  private errorHandler(error) {
    debugger;
  }

}
