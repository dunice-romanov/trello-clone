import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { BoardsService } from "../services/boards.service";
import { LoginService } from "../services/login.service";
import { Board, ShareBoard } from '../classes/board';

@Component({
  selector: 'app-boardlist-dropdown-bag',
  templateUrl: './boardlist-dropdown-bag.component.html',
  styleUrls: ['./boardlist-dropdown-bag.component.css']
})
export class BoardlistDropdownBagComponent implements OnInit {

  readonly TEXT_DELETE_OWNERS_BOARD = "x";
  readonly TEXT_UNSUBSCRIBE = "x";

  @Input() boards: Board[];
  @Input() title: string;
  @Input() isShared: boolean;

  @Output() boardClicked: EventEmitter<any> = new EventEmitter();

  constructor(private boardsService: BoardsService,
              private loginService: LoginService) { }

  ngOnInit() {
  }

  onClickBoard(event) {
    this.boardClicked.emit(true);
  }

  onClickDeleteBoard(board: Board, event) {
    event.stopPropagation();
    let id: number = +board.id; 
    //console.log(id);
    this.boardsService.deleteBoard(id).subscribe();
    return false;
  }


  onClickUnsubscribe(board: Board, event) {
    event.stopPropagation();
    let id: number = +board.id; 
    this.boardsService.getShareList(id)
        .subscribe(
          (data) => {
            let finalId = this.findBoardId(data);
            if (finalId !== -1) { this.boardsService.deleteSubscription(finalId, +board.id).subscribe(); }
          });
    return false;
  }
  
  findBoardId(shares: ShareBoard[]): number {
    let username = this.loginService.getUsername();
    let yourShareIndex = shares.findIndex((share) => share.username === username);
    if (yourShareIndex !== -1) {
      return shares[yourShareIndex].id;
    }
    return -1;
  }

  isUserOnBoard(idBoard: number) {

  }


}
