import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { LoginService } from '../services/login.service';
import { Board } from '../classes/board'

@Injectable()
export class BoardsService {

  readonly URL = "http://127.0.0.1:8000/api-boards/";
  readonly URL_CREATE = "create/"
  readonly URL_ADD_PERMISSION = "add-permission";
  readonly HEADER_AUTHORIZATION = 'Authorization';
  readonly HEADER_JWT = 'JWT';

  readonly ACCESS_LEVEL_OWNER = 'owner';
  readonly ACCESS_LEVEL_READONLY = 'read';
  readonly ACCESS_LEVEL_WRITE = 'write';


  constructor(private http: Http,
  			  private loginService: LoginService) { }

  /*
  	Send get request to server(URL) with authorization token from loginService
  	Returns User[] if ok,
  	Throws error if error
  */
  getUserList() {
    let token: string = this.loginService.getTokenString();
  	let headers: Headers = this.createHeaders(token);
  	
    return this.http.get(this.URL, {headers: headers})
  	  .map((response: Response) => { 
			 	  let resp = response.json();
          return this.parseBoards(resp); 

         })
			.catch( (error: any) => { return Observable.throw(error); } );
         			//throw error
  			 
  }


  createBoard(title: string) {
    let url: string = this.URL + this.URL_CREATE;
    let token: string = this.loginService.getTokenString();
    let headers: Headers = this.createHeaders(token);
    let body = {'title': title};
    return this.http.post(url, body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error));
  }


  deleteBoard(id: Number) {
    let url = this.URL + +id;
    let token: string = this.loginService.getTokenString();
    let headers: Headers = this.createHeaders(token);
    return this.http.delete(url, {headers: headers})
              .map((response: Response) => {return response})
              .catch((error: any) => {debugger; return Observable.throw(error)})
  }

  /*
    shares board with another user by POST[username, board_id]
  */
  shareBoard(boardId: Number, username: string) {
    let url = this.URL + this.URL_ADD_PERMISSION;
    let token: string = this.loginService.getTokenString();
    let headers: Headers = this.createHeaders(token);
    let body = {'username': username, 'board_id': boardId};
    debugger;
    return this.http.post(url, body, {headers: headers})
                    .map((response: Response) => {return response.json()})
                    .catch((error: any) => {return Observable.throw(error)})
  }

  /*
    Returns Board[] array if okay
  */
  private parseBoards(response: Object[]) {
    let boards: Board[] = []

    let owner: string, accessLevel: string, title: string, id: Number;

    for (let object of response) {
      if (true) {

        owner = object['board']['owner'];
        title = object['board']['title'];
        accessLevel = object['access_level'];
        id = object['board']['id']
        boards.push(new Board(title, accessLevel, owner, id))
      }
    }
    return boards;
  }

  private createHeaders(JWToken: string) {
    let headers: Headers = new Headers ({'Content-Type':  'application/json;charset=utf-8'});
    headers.append(this.HEADER_AUTHORIZATION, 
            this.HEADER_JWT + ' ' +  JWToken);
    return headers
  }

}
