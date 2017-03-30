import { Component, OnInit } from '@angular/core';
import { BoardsService } from '../services/boards.service';
import { LoginService } from '../services/login.service';
import { Board } from '../classes/board';

@Component({
  selector: 'app-boardlist-dropdown',
  templateUrl: './boardlist-dropdown.component.html',
  styleUrls: ['./boardlist-dropdown.component.css']
})
export class BoardlistDropdownComponent implements OnInit {

  readonly TEXT_OWNER_USER: string = "Personal boards";
  readonly TEXT_OWNER_NOT_USER: string = "Shared boards";
  readonly TEXT_BUTTON_GLOBAL = "Boards";
  readonly TEXT_SEARCH_BLANK = "Nothing found"
  readonly TEXT_SEARCH_INPUT_PLACEHOLDER = "Find boards by name...";

  private boards: Board[];
  private ownersBoards: Board[];
  private sharedBoards: Board[];
  private searchBoards: Board[];
  private searchOwnerBoards: Board[];
  private searchSharedBoards: Board[];


  private boardsLength: number;

  private isMenuCollapsed: boolean;
  private searchInput: string;

  constructor(private boardsService: BoardsService,
              private loginService: LoginService) {
    this.ownersBoards = [];
    this.sharedBoards = [];
    this.clearSearchBoards();
    this.isMenuCollapsed = false;
    this.searchInput = '';
  }

  ngOnInit() {
    this.getBoards();
  }

  private getBoards() {
    this.boardsService.getBoardList().subscribe(
      (data)=> {
        this.boardsLength = data.length;
        this.boards = data;
        this.searchBoards = [];
        this.fillBoards(data)
      }
    );
  }

  private onChangeSearch() {
    let input = this.searchInput.trim();
    if (input == '') { this.clearSearchBoards(); return; }
    console.log('searching');
    this.searchInBoards(input);
  }

  private errorHandler(error) {
    debugger;
  }

  private fillBoards(boards: Board[]) {
    let username = this.loginService.getUsername();
    this.ownersBoards = boards.filter((board) => board.boardOwner == username);
    this.sharedBoards = boards.filter((board) => board.boardOwner != username);
  }

  private searchInBoards(str: string) {
     this.searchOwnerBoards = this.searchInBoardBag(this.ownersBoards, str);
     this.searchSharedBoards = this.searchInBoardBag(this.sharedBoards, str);
  }

  private clearSearchBoards() {
    this.searchOwnerBoards = [];
    this.searchSharedBoards = [];
  }

  private searchInBoardBag (boardBag: Board[], str: string): Board[] {
    return boardBag.filter((val) => val.title.includes(str.trim())); 
  }

}
