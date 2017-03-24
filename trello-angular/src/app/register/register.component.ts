import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';


import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  readonly TEXT_USERNAME = 'Input user';
  readonly TEXT_PASSWORD = 'Input password';
	readonly TEXT_EMAIL = 'Input email';
  readonly TEXT_PLACEHOLDER_USERNAME = 'example: kokosik88';
  readonly TEXT_PLACEHOLDER_PASSWORD = 'your pass';
  readonly TEXT_PLACEHOLDER_EMAIL = 'example: some@mail.com';
  readonly TEXT_REGISTER = 'Register';

  readonly TEXT_ERROR_USER_EXISTS = 'User is already exists';
  readonly TEXT_ERROR_BAD_SYMBOLS = `Enter a valid username. This value may contain only letters, numbers, and @/./+/-/_ characters.`;
  readonly TEXT_ERROR_SERVER_PROBLEM = 'Server is unavailable';
  readonly TEXT_ERROR_BLANK_INPUT = 'Error: Your inputs are blank';
	
  private username: string;
	private	password: string;
  private email: string;

  constructor(private loginService: LoginService,
  						private router: Router) { 
  	this.username = '';
  	this.password = '';
    this.email = '';
  }

  ngOnInit() { }

  /*
  	Trimms username, runs loginService.register().
  	If user registered: navigate to '/home',
  	else - handles error
  	Finally - clears inputs
  */
  onClickRegister(username, password, email) {
    if (!this.checkEmail(this.email)) {alert('wrong email'); return;}
  	let trimmedUsername = this.username.trim();
  	this.loginService.register(trimmedUsername, password, email)
  										.subscribe(
  											data => {
  												this.router.navigate(['home']);
  											},
  											error => this.errorHandler(error)
  											);
  	this.clearInputs();
  }

  /*
  	Clears inputs
  */
  private clearInputs() {
  	this.username = '';
  	this.password = '';
    this.email = '';
  }

  /*
  	Handles register button's errors
    cases with blank field errors should'n have breaks
  */
  private errorHandler(error) {

    switch (error['_body']) {
      case this.loginService.ERROR_USERNAME_ALREADY_EXISTS:
        alert(this.TEXT_ERROR_USER_EXISTS)
        break;
      case this.loginService.ERROR_USERNAME_INVALID_SYMBOLS:
        alert(this.TEXT_ERROR_BAD_SYMBOLS);
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

  private checkEmail(email: string) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

}
