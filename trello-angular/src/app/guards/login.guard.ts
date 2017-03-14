import { Injectable } from '@angular/core';

import { CanActivate, ActivatedRouteSnapshot,
		 RouterStateSnapshot, Router } from "@angular/router";

import { LoginService } from "../services/login.service"

@Injectable()
export class LoginGuard implements CanActivate{
 
 	constructor(private loginService: LoginService, 
 				private router: Router) { }

    canActivate() {
	    if (this.loginService.isAuthenticated()) {
			this.router.navigate(['home']);
			return false;
		}
        return true;
    }
}