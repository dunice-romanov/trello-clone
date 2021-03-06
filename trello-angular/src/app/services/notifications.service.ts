import { Injectable, OnInit } from '@angular/core';

import { Http, RequestOptions, Headers, Response } from '@angular/http';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { WebSocketService } from '../services/web-socket.service';
import { Commentary, Notification } from '../classes/list'
import { LoginService } from '../services/login.service';
import { BoardsService } from '../services/boards.service';

@Injectable()
export class NotificationsService implements OnInit {

  private notifications: Subject<Notification[]> = new Subject<Notification[]>();
  notifications$ = this.notifications.asObservable();

  readonly URL_NOTIFICATIONS = "http://127.0.0.1:8000/api-posts/notifications/"
  readonly HEADER_AUTHORIZATION = 'Authorization';
  readonly HEADER_JWT = 'JWT';
  private webSocketSub: Subscription;
  public messages: Subject<string>;

  constructor(private loginService: LoginService,
              private http: Http,
              private socketService: WebSocketService,
              private boardsService: BoardsService) {
      if (this.loginService.isAuthenticated()) {
        this.updateNotifications().subscribe( (data) => data);
        this.runSocket();
      }
    }


  ngOnInit() {
  }


  updateNotifications() {
    let url: string = this.URL_NOTIFICATIONS;
    let token: string = this.loginService.getTokenString();
    let headers: Headers = this.createHeaders(token);
    return this.http.get(url, {headers: headers})
                    .map((response: Response)=> {
                        let resp = response.json();
                        let notifications = this.parseNotifications(resp);
                        this.notifications.next(notifications);
                        return notifications;
                    })
                    .catch((error: any) => { return Observable.throw(error) });

  }

  deleteNotifications(id: number) {
    let url: string = this.URL_NOTIFICATIONS + +id + '/';
    let token: string = this.loginService.getTokenString();
    let headers: Headers = this.createHeaders(token);

    return this.http.delete(url, {headers: headers})
                    .map((resp: Response)=> {
                      this.updateNotifications().subscribe();
                    })
                    .catch((error: any) => { return Observable.throw(error) });

  }

  private createHeaders(JWToken: string) {
    let headers: Headers = new Headers ({'Content-Type':  'application/json;charset=utf-8'});
    headers.append(this.HEADER_AUTHORIZATION,
            this.HEADER_JWT + ' ' +  JWToken);
    return headers;
  }

  private parseNotification(resp: Object) {
    let id: number = resp['id'];
    let username: string = resp['commentary']['username'];
    let text: string = resp['commentary']['text'];
    let created: Date = new Date(resp['commentary']['created']);
    let avatarUrl: string = 'http://127.0.0.1:8000' + resp['commentary']['avatar_url'];
    let commentary = new Commentary(username, text, created, avatarUrl);
    return new Notification(id, commentary);
  }

  private parseNotifications(resp: Object[]) {
    let notifications: Notification[] = [];

    for (let notification of resp) {
      let newNotify = this.parseNotification(notification);
      notifications.push(newNotify);
    }

    return notifications;
  }

  public runSocket() {

    if (this.webSocketSub) {
      console.log('in reconnection');
      this.webSocketSub.unsubscribe();

    }

    let url = "ws://127.0.0.1:8000/?token=" + this.loginService.getTokenString();

    console.log('in creation if');
    this.webSocketSub = this.socketService.connect(url)
                  .map((response: MessageEvent) => {
                      let data = response.data;
                      return data;
      }).subscribe((data) => {
        switch (data) {
          case 'new_notify':
            this.updateNotifications().subscribe();
            break;
          case 'board_update':
            this.boardsService.updateBoardsList().subscribe();
            break;
        }
      });
    }

}
