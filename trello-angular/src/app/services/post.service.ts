import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { LoginService } from '../services/login.service';
import { FullPost, Commentary, Notification } from '../classes/list'

@Injectable()
export class PostService {

  readonly URL_CLEAR = "http://127.0.0.1:8000";
  readonly URL_LIST_API = "http://127.0.0.1:8000/api-posts/";
  readonly URL_CREATE_LIST = 'create/';
  readonly URL_CREATE_COMMENTARY = 'create-commentary/';
  readonly HEADER_AUTHORIZATION = 'Authorization';
  readonly HEADER_JWT = 'JWT';

  readonly ERROR_BLANK_TITLE = JSON.stringify({"title":["This field may not be blank."]});
  readonly ERROR_DONT_HAVE_PERMISSION = JSON.stringify({"detail":"You do not have permission to perform this action."});


  
  constructor(private http: Http,
          private loginService: LoginService) { }

  /*
    Send get request to server(URL) with authorization token from loginService
    Returns List[] if ok,
    Throws error if error
  */
  getFullPost(postId: Number) {
    let url: string = this.URL_LIST_API + +postId;
    let token: string = this.loginService.getTokenString();
    let headers: Headers = this.createHeaders(token);

    return this.http.get(url, {headers: headers})
      .map((response: Response) => { 
          let resp = response.json();
          let fullPost = this.parseFullPost(resp);
          return fullPost;
         })
      .catch( (error: any) => { return Observable.throw(error); } );
               //throw error
         
  }

  patchPosition(postId: number, newPosition: number, newList: number) {
    let positionObject = {
      'position': newPosition,
      'cardlist': newList,
    }
    return this.patchPost(postId, positionObject);
  }

  /*
    patches post's title on a server
    returns FullPost object if ok,
    else - returns error
  */
  patchTitle(postId: number, title: string) {
    let titleObject = {'title': title}
    return this.patchPost(postId, titleObject);
  }

  /*
    patches post's text on a server
    returns FullPost object if ok,
    else - returns error
  */
  patchText(postId: number, text: string) {
    let textObject = {'text': text}
    return this.patchPost(postId, textObject);
  }

  /*
    patches post on a server
    returns FullPost object if ok,
    else - returns error
  */
  private patchPost(postId: number, patchObject: Object) {
    let url: string = this.URL_LIST_API + +postId;
    let token: string = this.loginService.getTokenString();
    let headers: Headers = this.createHeaders(token);

    return this.http.patch(url, patchObject, {headers: headers})
      .map((response: Response) => { 
          let resp = response.json();
          let fullPost = this.parseFullPost(resp);
          return fullPost;
         })
      .catch( (error: any) => { return Observable.throw(error); } );
  }

  postCommentary(postId: number, text: string) {

    let usernames = this.parseCommentaryForRefrences(text);
    this.parseCommentaryForRefrences(text);
    let url: string = this.URL_LIST_API + this.URL_CREATE_COMMENTARY;
    let token: string = this.loginService.getTokenString();
    let headers: Headers = this.createHeaders(token);
    let body = {
      'post': postId,
      'text': text
    }

    if (usernames.length > 0) {
      console.log('length > 0');
      let users = this.parseArrayToSpecialString(usernames);
      body['usernames'] = users;
      //console.log(JSON.stringify(usernames))
    }

    else { console.log('length =< 0')}

    return this.http.post(url, body, {headers: headers})
      .map((response: Response) => { 
            return response.json();
         })
      .catch( (error: any) => { return Observable.throw(error); } );
  }

  /*
    Creates basic headers for requests with token
  */
  private createHeaders(JWToken: string) {
    let headers: Headers = new Headers ({'Content-Type':  'application/json;charset=utf-8'});
    headers.append(this.HEADER_AUTHORIZATION, 
            this.HEADER_JWT + ' ' +  JWToken);
    return headers;
  }

  /*
    parse one object and returns list
  */
  private parseFullPost(response: Object): FullPost {
    let id: number = response['id'];
    let title: string = response['title'];
    let text: string = response['text'];
    let position: number = response['position'];
    let boardId: number = response['board'];
    let fullPost = new FullPost(id, title, text, position, boardId);
    fullPost.commentaries = this.parseAllComments(response['commentary']);

    return fullPost;
  }

  /*
    Parses response.json()[n] to new Commentary
  */
  private parseComment(response: Object): Commentary {
    let username: string = response['username'];
    let created: Date = new Date(response['created']);
    let text: string = response['text'];
    let avatarUrl = this.URL_CLEAR + response['avatar_url'];
    let comment = new Commentary(username, text, created, avatarUrl);

    return comment;
  }

  /*
    Parses response.json() to Commentary array 
  */
  private parseAllComments(response: Object[]): Commentary[] {
    let comments: Commentary[] = [];

    for (let comma of response) {
      let newComma = this.parseComment(comma);
      comments.push(newComma);
    }

    return comments;
  }

  private parseCommentaryForRefrences(text: string) {
    let regExp = /(?:^|\s)(@\w{2,})/g;
    let users: string[] = [];
    let exp = undefined;
    console.log('in parse text');
    while(exp !== null) {
      exp = regExp.exec(text);
      if (exp !== null) {
        let newVar = exp[1];
        users.push(newVar.slice(1));    //because 0 char is the special symbol '@'
      }
    }
    return users;
  } 

  /*
    format of this string is:
      ['a', 'b', 'c'] => "a,b,c,"
  */
  private parseArrayToSpecialString(usernames: string[]) {
    let result: string = "";
    for (let user of usernames) {
      result += user + ',';
    }
    console.log(result);
    return result;
  }

}
