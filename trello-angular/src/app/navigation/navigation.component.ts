import { Component, OnInit, Input } from '@angular/core';

import { LoginService } from '../services/login.service'

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

	readonly TEXT_HOME = 'Home';
	readonly TEXT_LOGIN = 'Login';
	readonly TEXT_REGISTER = 'Register';
	readonly TEXT_LOGOUT = 'Logout';
	readonly TEXT_PROFILE = 'Profile';
	readonly TEXT_BRAND = 'Shmrello';
	
	constructor(private loginService: LoginService) { }

	ngOnInit() {
	}
	
	/*
	Logout user by clicking the button
	*/
	onClickLogout() {
		this.loginService.logout();
	}


}
