import { Injectable, OnInit } from '@angular/core';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { UserToken, UserInfo } from "../classes/user"

@Injectable()
export class LoginService implements OnInit {
  /*
    Service for authentication on test Django rest server 
    by JWT. Next functions provided:
      - login()
      - register()
      - isAuthenticated()
      - logout()
      - refresh token()
  */

  readonly URL_CLEAR = 'http://localhost:8000';
  readonly URL_HEAD = "http://localhost:8000/api-auth/";
  readonly URL_SIGN_IN = "signin/";
  readonly URL_SIGN_UP = "signup/";
  readonly URL_REFRESH_TOKEN = "api-token-refresh/";
  readonly URL_VERIFY_TOKEN = "api-token-verify/";
  readonly URL_USER_INFO = 'users/';
  readonly HEADER_AUTHORIZATION = 'Authorization';
  readonly HEADER_JWT = 'JWT';
  readonly EXCEPTION_INPUT_TOKEN_IS_NULL = "INPUT TOKEN IS NULL";

  readonly ERROR_USERNAME_ALREADY_EXISTS = JSON.stringify({"username":["A user with that username already exists."]});
  readonly ERROR_USERNAME_PASS_INVALID = JSON.stringify({"non_field_errors":["Unable to login with provided credentials."]});
  readonly ERROR_USERNAME_INVALID_SYMBOLS = JSON.stringify({"username":["Enter a valid username. This value may contain only letters, numbers, and @/./+/-/_ characters."]});
  readonly ERROR_BLANK_PASSWORD_FIELD = JSON.stringify({"password":["This field may not be blank."]});
  readonly ERROR_BLANK_USERNAME_FIELD = JSON.stringify({"username":["This field may not be blank."]});
  readonly ERROR_BLANK_USERNAME_AND_PASSWORD_FIELDS = JSON.stringify({"password":["This field may not be blank."],"username":["This field may not be blank."]});
  
  readonly KEY = 'token_key';

  private isLoggedIn: boolean;

  constructor(private http: Http, private router: Router) {
    this.setIsLoggedIn(this.isTokenSetInLocalStorage(), 
                                         'constructor');
  }

  ngOnInit() { }


  /*
    Returns UserToken from localStorage by this.KEY

    if token doesn't exist -> returns null
  */
  getTokenFromLocalStorage() {
    let tokenString = localStorage.getItem(this.KEY);
    if (tokenString === null) { return null; }

    return JSON.parse(tokenString)
  }

  /*
    Returns token as string if exists,
    If token is absent - returns null
  */
  getTokenString() {
    let userToken = this.getTokenFromLocalStorage();
    if (userToken !== null) {
      return userToken['token']; 
    }
    return null;
  }

  /*
    Returns username as string if exists,
    If token is absent - returns null
  */
  getUsername() {
    let userToken = this.getTokenFromLocalStorage();
    if (userToken !== null) {
      return userToken['username']; 
    }
    return null;
  }

  /* 
    Returns true if user is authorized,
    Else - returns false
  */
  isAuthenticated(): boolean {
    return this.isTokenSetInLocalStorage();
  }

  /*
    Log in user by username:password, set token to localStorage
    return UserToken object to subscriber with actual token and username

    If any errors happens: throws an erorr
  */
  login(username: string, password: string) {

    let url: string = this.URL_HEAD + this.URL_SIGN_IN;

    let body: string = this.createBodyWithUsernamePassword(username, password)
    let headers: Headers = new Headers ({'Content-Type':  'application/json;charset=utf-8'});
    return this.createToken(username, password, url, body, headers);                          
  }

  /*
    Send post request to url with body(username, string), headers
    If success - set token to localStorage, 
               - set isLoggedIn=true,
               - returns Observable with UserToken
    Else - throws Observable with error 
  */
  createToken(username: string, password: string, url: string, 
              body: string, headers: Headers) {
                
        return this.http.post(url, body, { headers: headers })
                    .map((response: Response) => {
                      let responseObject = response.json();
                      let token: UserToken = new UserToken(username, responseObject['token'])
                      this.setTokenToLocalStorage(token);
                      this.setIsLoggedIn(true, 'register, map');
                      return token;
                    })
                    .catch((error:any) => { 
                      this.setIsLoggedIn(false, 'register, error');
                      return Observable.throw(error) 
                    });              //throws error!
  }

  /*
    Removes authentication data from localStorage and service,
    navigate to Login page
  */
  logout(){
    localStorage.removeItem(this.KEY);
    this.setIsLoggedIn(false, 'logout');
    this.router.navigate(['']);
  }

  /*
    Register new user by username:password,
    return UserToken object to subscriber with actual token and username

    If any errors happens: throws an error
  */
  register(username: string, password: string, email: string) {
    let url: string = this.URL_HEAD + this.URL_SIGN_UP;
    let body: string = this.createBodyWithUsernamePassword(username, password);
    let body_ = JSON.parse(body)
    body_['email'] = email;
    body = JSON.stringify(body_);
    let headers: Headers = new Headers ({'Content-Type': 
                                'application/json;charset=utf-8'});

    return this.createToken(username, password, url, body, headers);
  }

  /*
    Get full user info from server:
    if not authenticated - returns null,
    else - returns UserInfo or error (if any errors occures)
  */
  getFullUserInfo() {
    if (!this.isAuthenticated()) {return null;}

    let url: string = this.URL_HEAD;
    let token: string = this.getTokenString();
  	let headers: Headers = this.createHeaders(token);

    return this.http.get(url, {headers: headers})
  	  .map((response: Response) => { 
			 	  let resp = response.json();
          let userInfo: UserInfo = this.parseUserInfo(resp);
          return userInfo;

         })
			.catch( (error: any) => { return Observable.throw(error); } );
         			//throw error

  }


  changePassword(password: string) {
    let body = { 'password': password }
    return this.patchUser(body);
  }

  changeAvatar(file: any) {
    let token: string = this.getTokenString();
    let formData:FormData = new FormData();
        formData.append('avatar', file, file.name);
    let headers = new Headers()
        headers.append(this.HEADER_AUTHORIZATION, this.HEADER_JWT + ' ' +  token);
        headers.append('Accept', 'application/json');
    let options = new RequestOptions({ headers: headers });
    return this.http.patch(this.URL_HEAD, formData, options)
            .map(res => res.json())
            .catch(error => Observable.throw(error))
  }

  patchUserInfo(userInfo: UserInfo) {
    return this.patchUser(userInfo.getObject());
  }

  private patchUser(patchBody: Object) {
    if (!this.isAuthenticated()) {return null;}

    let url: string = this.URL_HEAD;
    let token: string = this.getTokenString();
  	let headers: Headers = this.createHeaders(token);
    return this.http.patch(url, patchBody, {headers: headers})
  	  .map((response: Response) => { 
        ;
			 	  let resp = response.json();
          let userInfo: UserInfo = this.parseUserInfo(resp);
          return userInfo;

         })
			.catch( (error: any) => { debugger; return Observable.throw(error); } );
         			//throw error
  }

  /*
    Refreshes token from localStorage,
    If succsess returns observable
    Else - throws observable's custom exception
  */
  refreshToken() {
    let token: string = this.getTokenFromLocalStorage();
    
    if (token !== null) {
      return this.refreshTokenWithInput(token['token']);
    }

    return Observable.throw(this.EXCEPTION_INPUT_TOKEN_IS_NULL);    //exception
  }

  private setIsLoggedIn(value: boolean, from: any) {
    this.isLoggedIn = value;
  }

  /*
    Refresh input token:
      If succses -> return new token as string
      Else -> throws an error
  */
  private refreshTokenWithInput(token: string) {
    let url: string = this.URL_HEAD + this.URL_REFRESH_TOKEN;
    let body: string = this.createBodyWithToken(token);
    let headers: Headers = new Headers ({'Content-Type': 
                                'application/json;charset=utf-8'});
    return this.http.post(url, body, { headers: headers })
                    .map((response: Response) => {
                      let responseObject = response.json();
                      this.updateTokenInLocalStorage(responseObject['token']);
                      return responseObject['token'];
                    })
                    .catch((error:any) => { return Observable.throw(error) });            //throws error!
  }

  /*
    Set UserToken to LocalStorage with this.KEY

    if UserToken exists -> replace it
    if UserToken doesn't exist -> set it

    return True if completed
  */
  private setTokenToLocalStorage(userToken: UserToken) {
    localStorage.setItem(this.KEY, JSON.stringify(userToken));
    return true;
  }

  /*
    If token exists in localStorage -> return true
    Else -> return false
  */
  private isTokenSetInLocalStorage(): boolean {
    let tokenString = localStorage.getItem(this.KEY);
    if (tokenString !== null) { return true; }
    return false;
  }

  private createBodyWithUsernamePassword(username: string, password: string) {
    let body = {
      'username': username,
      'password': password
    }
    return JSON.stringify(body);
  }

  private createBodyWithToken(token: string) {
    let body = {
      'token': token,
    }
    return JSON.stringify(body);
  }

  /*
    Updates (string)token in localStorage 
    if succssed returns true, else - false
  */
  private updateTokenInLocalStorage(token: string) {
    if (this.isTokenSetInLocalStorage()) {
      let tokenString = localStorage.getItem(this.KEY);
      let tokenObj = JSON.parse(tokenString);
      tokenObj['token'] = token;
      localStorage.setItem(this.KEY, JSON.stringify(tokenObj));
      return true;
    }
    return false;
  }

  private parseUserInfo(response: Object): UserInfo {
    let id = response['id'];
    let username = response['username'];
    let lastName = response['last_name'];
    let firstName = response['first_name'];
    let bio = response['bio'];
    let email = response['email'];
    let urlAvatar = this.URL_CLEAR + response['avatar']

    let userInfo = new UserInfo(id, username, firstName, 
                                lastName, bio, email, urlAvatar);
    return userInfo;
  }

  private createHeaders(JWToken: string) {
    let headers: Headers = new Headers ({'Content-Type':  'application/json;charset=utf-8'});
    headers.append(this.HEADER_AUTHORIZATION, 
            this.HEADER_JWT + ' ' +  JWToken);
    return headers;
  }



}