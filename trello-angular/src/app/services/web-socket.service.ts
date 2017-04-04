import { Injectable } from '@angular/core';
import { Subject, Observable, Subscription, Observer } from 'rxjs/Rx';
import { WebSocketSubject }   from "rxjs/observable/dom/WebSocketSubject";

import { LoginService } from "../services/login.service";

@Injectable()
export class WebSocketService {

  readonly URL_WEBSOCKET = "ws://127.0.0.1:8000/?token=";
  private socket: Subject<MessageEvent>;

  constructor(private loginService: LoginService) { }
  
  public connect(): Subject<MessageEvent> {
    console.log('in connect');
    if(!this.socket) {
      let url = this.URL_WEBSOCKET + this.loginService.getTokenString(); 
      this.socket = this.create(url);
    }

    return this.socket;
  }


  private create(url): Subject<MessageEvent> {
    let ws = new WebSocket(url);

    let observable = Observable.create(
        (obs: Observer<MessageEvent>) => {
            ws.onmessage = obs.next.bind(obs);
            ws.onerror = obs.error.bind(obs);
            ws.onclose = obs.complete.bind(obs);

            return ws.close.bind(ws);
        }
    );

    let observer = {
        next: (data: Object) => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify(data));
            }
        },
        error: () => {
          debugger;
              setTimeout( () => {
                  this.connect();
              }, 1000 );
        }
    };

    return Subject.create(observer, observable);
}


  


}
