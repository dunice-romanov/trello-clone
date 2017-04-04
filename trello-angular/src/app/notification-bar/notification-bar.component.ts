import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { Notification } from '../classes/list';

import { NotificationsService } from '../services/notifications.service';

@Component({
  selector: 'app-notification-bar',
  templateUrl: './notification-bar.component.html',
  styleUrls: ['./notification-bar.component.css']
})
export class NotificationBarComponent implements OnInit, OnDestroy, OnChanges {

  readonly TEXT_NOTIFICATION_MENU_TITLE = "Notifications";
  readonly TEXT_CLOSE = 'X';
  readonly TEXT_MENTIONED_YOU = "mentioned you";
  readonly TEXT_NOTIFICATION_BUTTON = "New messages: ";

  private notifications: Notification[]; 
  private notifySub: Subscription;
  private isMenuCollapsed: boolean = false;
  private isAlert = false;

  constructor(private notifyService: NotificationsService) {

    this.notifications = [];

   }

  ngOnInit() {
    this.notifySub = this.notifyService.notifications$
                      .subscribe((data) => {
                                    this.notifications = data; 
                                    if (this.notifications.length > 0) { this.isAlert = true; }
                                    else { this.isAlert = false; }
                                  }, 
                                 (error)=>{debugger});
  }

  ngOnDestroy() {
    this.notifySub.unsubscribe();
  }

  ngOnChanges() {
    console.log()
    if(this.notifications.length === 0) { this.isAlert = false; }
    else { this.isAlert = true; }
  }

  onClickButtonMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
    if (this.isMenuCollapsed == true) {
      this.notifyService.updateNotifications().subscribe();
    }
  }

  onClickDeleteNotification(id: number, event) {

    this.notifyService.deleteNotifications(id).subscribe();

    return false;
  }



}
