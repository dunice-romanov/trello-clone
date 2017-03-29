import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Response} from '@angular/http';
import { BoardsService } from '../services/boards.service';
import { Board } from '../classes/board';
import { SharingComponent } from '../sharing/sharing.component';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  readonly TEXT_USERNAME = 'Username';
	readonly TEXT_UPDATE_BOARD = 'Update boards';
  readonly TEXT_CREATE_BOARD = 'Name it and press enter!';
  readonly TEXT_DELETE_BOARD = 'x';
  readonly TEXT_SHARE_BOARD = 'Share';
  readonly TEXT_ERROR_SERVER_PROBLEM = 'Server is unavailable';
  readonly TEXT_ERROR_MAX_LENGTH = "Title can't be more than 100 symbols"; 

  private username: string;
  private boardTitle: string;
  private boardList: Board[];
  private isCollapsed: boolean;
  private accessLevel: string;
  private sub: Subscription;

  private ownerBoards: Board[];
  private sharedBoards: Board[];

  constructor(private loginService: LoginService,
              private boardsService: BoardsService,
              private modalService: NgbModal) { 
  	this.username = '';
    this.boardList = [];
    this.boardTitle = '';
    this.isCollapsed = true;
  }

  ngOnInit() {
    console.log('home init called');
    this.username = this.loginService.getUsername();
    this.sub = this.boardsService.getBoardList().subscribe((val) => {this.fillBoards(val)});
    this.boardsService.updateBoardsList().subscribe();
}

  ngOnDestroy() {
    this.sub.unsubscribe();
    console.log('home ondestroy');
  }


  onEnterCreateBoard() {
    let title = this.boardTitle.trim();
    if (title == '') { return; }

    this.boardsService.createBoard(title)
        .subscribe( 
          (data) => {
            this.isCollapsed = true;
            this.boardTitle = '';
              }, 
          (error) => {this.errorHandler(error);});
  }

  /*
    makes DELETE request on a server with board id,
    returns false for stop propogation
  */
  onClickDeleteBoard(boardId: number, event) {
    event.stopPropagation();
    this.boardsService.deleteBoard(boardId)
         .subscribe( (data) => {},
                     (error) => {this.errorHandler(error);} );
    return false;
  }

  onClickCollapseForm(){
    this.isCollapsed = !this.isCollapsed;
    this.boardTitle = '';
  }

  /*
    Calls bootstrap's modal window for SharingComponent,
    returns false for stop propogations
  */
  onClickShareBoard(boardId: number, event) {
    
    event.stopPropagation();
    const modalRef = this.modalService.open(SharingComponent);
    modalRef.componentInstance.boardId = boardId; 

    return false;
  }

  private fillBoards(boards: Board[]) {
    let username = this.loginService.getUsername();
    this.ownerBoards = boards.filter((board) => board.boardOwner == username);
    this.sharedBoards = boards.filter((board) => board.boardOwner != username);
  }

  private stopPropagation(event) {
    event.stopPropagation();
  }

  /*
    Handles server's errors
  */
  private errorHandler(error) {
    switch (error['_body']) {
      case this.boardsService.ERROR_TITLE_MAX_LENGTH:
        alert(this.TEXT_ERROR_MAX_LENGTH);
        this.boardTitle = '';
        break;
      default:
        alert(this.TEXT_ERROR_SERVER_PROBLEM);
        break;
    }
  }
}
