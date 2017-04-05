import { Injectable } from '@angular/core';
import { Subject, Observable, Subscription, Observer } from 'rxjs/Rx';
import { WebSocketSubject }   from "rxjs/observable/dom/WebSocketSubject";

import { LoginService } from "../services/login.service";

@Injectable()
export class WebSocketService {

  private socket: Subject<MessageEvent>;
  private isConnected: boolean = false;

  constructor() { }
  
  public connect(url): Subject<MessageEvent> {
    console.log('in connect');
    if(!this.socket || !this.isConnected) {
      this.socket = this.create(url);
      this.isConnected = true;
    }

    return this.socket;
  }

  close() {
    this.socket.complete();
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
                  this.connect(url);
              }, 1000 );
        },
        complete: () => {
          ws.close();
          this.isConnected = false;
        }
    };

    return Subject.create(observer, observable);
}


  


}
