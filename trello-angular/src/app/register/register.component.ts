import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';


import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  readonly TEXT_PLACEHOLDER_USERNAME = 'Input user';
  readonly TEXT_PLACEHOLDER_PASSWORD = 'Input password';
	
  readonly TEXT_REGISTER = 'Register';

  readonly TEXT_ERROR_USER_EXISTS = 'User is already exists';
  readonly TEXT_ERROR_BAD_SYMBOLS = `Enter a valid username. This value may contain only letters, numbers, and @/./+/-/_ characters.`;
  readonly TEXT_ERROR_SERVER_PROBLEM = 'Server is unavailable';
  readonly TEXT_ERROR_BLANK_INPUT = 'Error: Your inputs are blank';
	
  private username: string;
	private	password: string;

  constructor(private loginService: LoginService,
  						private router: Router) { 
  	this.username = '';
  	this.password = '';
  }

  ngOnInit() { }

  /*
  	Trimms username, runs loginService.register().
  	If user registered: navigate to '/home',
  	else - handles error
  	Finally - clears inputs
  */
  onClickRegister(username, password) {
  	let trimmedUsername = this.username.trim();
  	this.loginService.register(trimmedUsername, password)
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
        debugger;
        alert(this.TEXT_ERROR_SERVER_PROBLEM);
        break;
    }
  }

}
