import { Component, OnInit, OnChanges } from '@angular/core';
import { BoardsService } from '../services/boards.service';
import { LoginService } from '../services/login.service';
import { Board } from '../classes/board';

@Component({
  selector: 'app-boardlist-dropdown',
  templateUrl: './boardlist-dropdown.component.html',
  styleUrls: ['./boardlist-dropdown.component.css']
})
export class BoardlistDropdownComponent implements OnInit, OnChanges {

  readonly TEXT_OWNER_USER = "Personal boards";
  readonly TEXT_OWNER_NOT_USER = "Shared boards";
  readonly TEXT_BUTTON_GLOBAL = "Boards";

  private boards: Board[];
  private ownersBoards: Board[];
  private sharedBoards: Board[];
  private boardsLength: number;

  private isMenuCollapsed: boolean;
  


  constructor(private boardsService: BoardsService,
              private loginService: LoginService) {
    this.ownersBoards = [];
    this.sharedBoards = [];
    this.isMenuCollapsed = false;
  }

  ngOnInit() {
    this.getBoards();
  }

  ngOnChanges() {
    console.log('boardlist onchanges');
  }

  private getBoards() {
    this.boardsService.getBoardList().subscribe(
      (data)=> {
        this.boardsLength = data.length;
        this.fillBoards(data)
      }
    );
  }

  private errorHandler(error) {
    debugger;
  }

  private fillBoards(boards: Board[]) {
    let username = this.loginService.getUsername();
    this.ownersBoards = boards.filter((board) => board.boardOwner == username);
    this.sharedBoards = boards.filter((board) => board.boardOwner != username);
  }

}
