import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { LoginService } from '../services/login.service';
import { List, Post } from '../classes/list'

@Injectable()
export class ListsService{

  readonly URL_LIST_API = "http://127.0.0.1:8000/api-lists/";
  readonly URL_POST_API =  "http://127.0.0.1:8000/api-posts/";
  readonly URL_CREATE_POST = "create/";
  readonly URL_GET_LIST_BY_ID = '?id=';
  readonly URL_CREATE_LIST = 'create/'
  readonly HEADER_AUTHORIZATION = 'Authorization';
  readonly HEADER_JWT = 'JWT';


  constructor(private http: Http,
  			  private loginService: LoginService) { }

  /*
  	Send get request to server(URL) with authorization token from loginService
  	Returns List[] if ok,
  	Throws error if error
  */
  getListsList(boardId: Number) {
    let url: string = this.URL_LIST_API + this.URL_GET_LIST_BY_ID + +boardId;
    let token: string = this.loginService.getTokenString();
  	let headers: Headers = this.createHeaders(token);

    return this.http.get(url, {headers: headers})
  	  .map((response: Response) => { 
			 	  let resp = response.json();
          let lists = this.parseAllLists(resp);
          return lists;
         })
			.catch( (error: any) => { return Observable.throw(error); } );
         			//throw error
  			 
  }

  /*
    creates list on a server
    returns List if ok, else throws error
  */
  createList(boardId: Number, title: string) {
    let url: string = this.URL_LIST_API + this.URL_CREATE_LIST;
    let token: string = this.loginService.getTokenString();
    let headers: Headers = this.createHeaders(token);
    let body = {
      'board': boardId,
      'title': title
    }
    return this.http.post(url, body, {headers: headers})
      .map((response: Response) => { 
          return this.parseList(response.json());
         })
      .catch( (error: any) => { return Observable.throw(error); } );
               //throw error
  }

  /*
    creates post on a server
    returns Object if ok, else throws error
  */
  createPost(listId: Number, title: string, text: string) {
    let url: string = this.URL_POST_API;
    let token: string = this.loginService.getTokenString();
    let headers: Headers = this.createHeaders(token);
    let body = {
      'board': listId,
      'text': text,
      'title': title
    }
    return this.http.post(url, body, {headers: headers})
      .map((response: Response) => { 
          return response.json();
         })
      .catch( (error: any) => { return Observable.throw(error); } );
               //throw error
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
  private parseList(response: Object): List {
    debugger;
    let list = new List(response['title'], response['id']);

    for (let post of response['posts']) {
      let newPost = new Post(post['id'], post['title'], post['text'])

      list['posts'].push(newPost);
      
    }
    return list;

  }

  /*
    parses response array of server objects
     and returns as List[]
  */
  private parseAllLists(responses: Object[]): List[] {
    let lists: List[] = []
    for (let response of responses) {
      let newList = this.parseList(response);
      lists.push(newList);
    }
    return lists;
  }

}
