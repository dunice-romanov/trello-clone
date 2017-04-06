import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Subject } from 'rxjs/Subject';

import { LoginService } from '../services/login.service';
import { Board, ShareBoard } from '../classes/board'

@Injectable()
export class BoardsService {

  readonly URL = "http://127.0.0.1:8000/api-boards/";
  readonly URL_CREATE = "create/"
  readonly URL_ADD_PERMISSION = "add-permission";
  readonly URL_ACCESS_PERMISSION = "permission/";
  readonly URL_GET_PERMISSION_USERS = "get-sharing-list/?id=";
  readonly HEADER_AUTHORIZATION = 'Authorization';
  readonly HEADER_JWT = 'JWT';

  readonly ACCESS_LEVEL_OWNER = 'owner';
  readonly ACCESS_LEVEL_READONLY = 'read';
  readonly ACCESS_LEVEL_WRITE = 'write';

  readonly ERROR_TITLE_MAX_LENGTH = JSON.stringify({"title":["Ensure this field has no more than 100 characters."]})
  readonly ERROR_USER_DOES_NOT_EXISTS = JSON.stringify({"detail":"Not found."});

  private boards: Board[];

  private boardsSubject = new Subject<Board[]>();
  public sub = this.boardsSubject.asObservable();

  constructor(private http: Http,
  			  private loginService: LoginService,
          private router: Router) {
    this.boards = [];
    this.updateBoardsList().subscribe((val)=> {this.boards = val;});
  }


  getBoardList() {
    return this.boardsSubject.asObservable();
  }

  /*
  	Send get request to server(URL) with authorization token from loginService
  	Returns Board[] if ok,
  	Throws error if error
  */
  updateBoardsList() {
    let token: string = this.loginService.getTokenString();
  	let headers: Headers = this.createHeaders(token);

    return this.http.get(this.URL, {headers: headers})
  	  .map((response: Response) => {
			 	  let resp = response.json();
          this.boards = this.parseBoards(resp);
          this.boardsSubject.next(this.boards);
          if (this.isUserInsideVanishedBoard(this.boards)) {this.navigateToHome()}
          return this.boards;
         })
			.catch( (error: any) => { return Observable.throw(error); } );
         			//throw error

  }

/*
  Creates board with Post[title],
    if ok - return response.json() in data,
    else - returns error
*/
  createBoard(title: string) {
    let url: string = this.URL + this.URL_CREATE;
    let token: string = this.loginService.getTokenString();
    let headers: Headers = this.createHeaders(token);
    let body = {'title': title};

    return this.http.post(url, body, {headers: headers})
            .map(
              (response: Response) => {
                this.updateBoardsList().subscribe();
                return response.json();
              })
            .catch((error: any) => Observable.throw(error));
  }

/*
  Delete board with Post[title],
    if ok - return Response in data,
    else - returns error
*/
  deleteBoard(id: number) {
    let url = this.URL + +id;
    let token: string = this.loginService.getTokenString();
    let headers: Headers = this.createHeaders(token);

    return this.http.delete(url, {headers: headers})
              .map(
                (response: Response) => {
                  if (this.isUserInBoard(id)) { this.navigateToHome(); }
                  this.updateBoardsList().subscribe();
                  return response;
                })
              .catch((error: any) => {debugger; return Observable.throw(error)})
  }

  /*
    shares board with another user by POST[username, board_id]
  */
  shareBoard(boardId: number, username: string, accessLevel: string) {
    let url = this.URL + this.URL_ADD_PERMISSION;
    let token: string = this.loginService.getTokenString();
    let headers: Headers = this.createHeaders(token);
    let body = {'username': username, 'board_id': boardId, 'access_level': accessLevel};
    return this.http.post(url, body, {headers: headers})
                    .map((response: Response) => {return response.json()})
                    .catch((error: any) => {return Observable.throw(error)})
  }

  getShareList(boardId: number) {
    let url = this.URL + this.URL_GET_PERMISSION_USERS + boardId;
    let token: string = this.loginService.getTokenString();
    let headers: Headers = this.createHeaders(token);
    return this.http.get(url, {headers: headers})
                    .map((response: Response) => {
                      let resp = response.json();
                      return this.parseShareBoards(resp);
                     })
                    .catch((error: any) => {return Observable.throw(error)});
  }

  getBoardTitle(boardId: number) {
    let url = this.URL + +boardId;
    let token: string = this.loginService.getTokenString();
    let headers: Headers = this.createHeaders(token);
    return this.http.get(url, {headers: headers})
                    .map((response: Response) => {
                      let resp = response.json();
                      return resp['title'];
                     })
                    .catch((error: any) => {return Observable.throw(error)});
  }

  patchTitle(boardId: number, title: string) {
    let body = {'title': title};
    return this.updateBoard(boardId, body);
  }

  deleteSubscription(id: number, boardId: number, preventNavigation = false) {
    let url = this.URL + this.URL_ACCESS_PERMISSION + +id;
    let token: string = this.loginService.getTokenString();
    let headers: Headers = this.createHeaders(token);



    return this.http.delete(url, {headers: headers})
              .map((response: Response) => {
                  if (!preventNavigation) {
                    if (this.isUserInBoard(boardId)) {
                      this.navigateToHome();
                    }
                  }
                this.updateBoardsList().subscribe();
                return response; })
              .catch((error: any) => { return Observable.throw(error) });
  }

  private updateBoard(boardId: number, patchObject: Object) {
    let url: string = this.URL + +boardId;
    let token: string = this.loginService.getTokenString();
    let headers: Headers = this.createHeaders(token);

    return this.http.patch(url, patchObject, {headers: headers})
      .map((response: Response) => {
          this.updateBoardsList().subscribe();
          let resp = response.json();
          return resp;
         })
      .catch( (error: any) => { return Observable.throw(error); } );
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

  private parseShareBoard (response: Object): ShareBoard {
    let id: number = response['id'];
    let username: string = response['user'];
    let accessLevel: string = response['access_level'];
    let boardId: number = response['board']['id'];
    let title: string = response['board']['title'];
    let shareBoard: ShareBoard = new ShareBoard(id, username, accessLevel, boardId, title);
    return shareBoard;
  }

  private parseShareBoards(response: Object[]): ShareBoard[]{
    let shareBoards: ShareBoard[] = [];
    for (let resp of response) {
      let newBoard = this.parseShareBoard(resp);
      shareBoards.push(newBoard);
    }
    return shareBoards;
  }

  private isUserInBoard(boardId): boolean {
    let arr = this.router.url.split('/'); // url to board is ["", "boards", id]
    if (arr[2]==""+boardId) { return true; } //2 because id is third
    return false;
  }

  private navigateToHome() {
    this.router.navigate(['home']);
  }

  private isUserInLists(): boolean {
    if (this.router.url.split('/')[1] == 'boards') { return true; }
    return false;
  }

  private getUserActualBoard(): number {
    if (!this.isUserInLists()) { return }
    let arr = this.router.url.split('/'); // url to board is ["", "boards", id]
    return +arr[2];
  }

  private isUserHaveBoard(boardId: number, userBoards: Board[]): boolean {
    for (let board of userBoards) {
      if (this.isUserInBoard(board.id)) return true;
    }
    return false;
  }

  private isUserInsideVanishedBoard(boards: Board[]) {
    if (!this.isUserInLists()) { return false }
    let boardId: number = this.getUserActualBoard();

    if (!this.isUserHaveBoard(boardId, boards)) { return true }
    return false;
  }

}
