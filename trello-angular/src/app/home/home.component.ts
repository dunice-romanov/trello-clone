import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Response} from '@angular/http';
import { BoardsService } from '../services/boards.service';
import { Board } from '../classes/board';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [BoardsService]
})
export class HomeComponent implements OnInit {

  readonly TEXT_USERNAME = 'Username';
	readonly TEXT_UPDATE_BOARD = 'Update boards';
  readonly TEXT_CREATE_BOARD = 'Create boards';
  readonly TEXT_DELETE_BOARD = 'Delete board';
  readonly TEXT_SHARE_BOARD = 'Share board';
  readonly TEXT_ERROR_SERVER_PROBLEM = 'Server is unavailable';
  
  private username: string;
  private boardTitle: string;
  private boardList: Board[];

  constructor(private loginService: LoginService,
              private boardsService: BoardsService) { 
  	this.username = '';
    this.boardList = [];
    this.boardTitle = '';
  }

  ngOnInit() {
    this.username = this.loginService.getUsername();
    this.setBoardList();
  }

  /*
    Updates this.boardList from server's data
    If reject - handles error by errorHandler()
  */
  onClickGetBoards() {
    this.setBoardList();
  }


  onClickCreateBoard() {
    let title = this.boardTitle.trim();
    if (title == '') { return; }

    this.boardsService.createBoard(title).subscribe( (data) => {this.setBoardList();}, 
      (error) => {debugger});
  }

  onClickDeleteBoard(id: Number) {
    this.boardsService.deleteBoard(id)
         .subscribe( (data) => {this.setBoardList()},
                     (error) => {debugger;} )
  }

  onClickShareBoard(boardId: Number, username: string) {
    this.boardsService.shareBoard(boardId, username)
            .subscribe( (data) => {},
                         (error)=>{debugger;})
  }


  /*
    Requests server's boardlist and sets to this.boardList
    If reject - handle an error by errorHandler()
  */
  private setBoardList() {
    this.boardsService.getUserList().subscribe(
        (data) => { this.boardList = data },
        (error) => { debugger; }
      );
  }

  /*
    Handles server's errors
  */
  errorHandler(error) {
    debugger;
    alert(this.TEXT_ERROR_SERVER_PROBLEM);
    this.loginService.logout();
  }
}
