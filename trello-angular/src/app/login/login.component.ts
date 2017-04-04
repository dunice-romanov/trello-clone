import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'

import { NotificationsService } from '../services/notifications.service';
import { LoginService } from '../services/login.service'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'], 
})
export class LoginComponent implements OnInit {

  readonly TEXT_PLACEHOLDER_USERNAME = 'username';
  readonly TEXT_PLACEHOLDER_PASSWORD = 'password';
  readonly TEXT_BUTTON_LOGIN = 'Login!';

  readonly TEXT_ERROR_INVALID_USERNAME_PASSWORD = 'Invalid username or password';
  readonly TEXT_ERROR_SERVER_PROBLEM = 'Server is unavailable';
  readonly TEXT_ERROR_BLANK_INPUT = 'Error: Your inputs are blank';

  private username: string;
  private password: string;

  constructor(private loginService: LoginService, 
              private router: Router,
              private notifyService: NotificationsService) { 
    this.username = "";
    this.password = "";
  }

  ngOnInit() { }

  /*
    Trimms username, runs loginService.login().
    If user registered: navigate to '/home',
    else - handles error
    Finally - clears inputs
  */
  onClickLogin(username, password) {
    let trimmedUsername: string = this.username.trim();
    
    this.loginService.login(trimmedUsername, password)            
                      .subscribe(
                        data => {
                          this.router.navigate(['home']);
                          this.notifyService.updateNotifications().subscribe((data)=>data);
                        },
                        error => {
                          this.errorHandler(error);
                        });
    this.clearInputs();                  
  }

  /*
    Clears inputs
  */
  private clearInputs() {
    this.username = '';
    this.password = '';
  }

  /*
    Handles login button's errors,
    cases with blank field errors should'n have breaks
  */
  private errorHandler(error) {
    switch (error['_body']) {
      case this.loginService.ERROR_USERNAME_PASS_INVALID:
        alert(this.TEXT_ERROR_INVALID_USERNAME_PASSWORD)
        break;

      case this.loginService.ERROR_BLANK_PASSWORD_FIELD:                  //it's okay without break
      case this.loginService.ERROR_BLANK_USERNAME_FIELD:                  //it's okay without break
      case this.loginService.ERROR_BLANK_USERNAME_AND_PASSWORD_FIELDS:
        alert(this.TEXT_ERROR_BLANK_INPUT);
        break;

      default:
        alert(this.TEXT_ERROR_SERVER_PROBLEM);
        break;
    }
  }

}
