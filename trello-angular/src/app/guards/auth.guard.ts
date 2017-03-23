import { Injectable } from '@angular/core';

import { CanActivate, ActivatedRouteSnapshot,
		 RouterStateSnapshot, Router } from "@angular/router";

import { LoginService } from "../services/login.service"

@Injectable()
export class AuthGuard implements CanActivate{
 
 	constructor(private loginService: LoginService, 
 				private router: Router) { }

    canActivate() {
	    if (!this.loginService.isAuthenticated()) {
			this.router.navigate(['']);
			console.log('can activate false');
			return false;
		}
		console.log('can activate true');
        return true;
    }
}