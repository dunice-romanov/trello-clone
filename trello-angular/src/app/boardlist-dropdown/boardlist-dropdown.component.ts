import { Component, OnInit, OnChanges } from '@angular/core';
import { BoardsService } from '../services/boards.service';

import { Board } from '../classes/board';

@Component({
  selector: 'app-boardlist-dropdown',
  templateUrl: './boardlist-dropdown.component.html',
  styleUrls: ['./boardlist-dropdown.component.css'],
  providers: [BoardsService] 
})
export class BoardlistDropdownComponent implements OnInit, OnChanges {

  private boards: Board[];

  constructor(private boardsService: BoardsService) {

  }

  ngOnInit() {
    this.getBoards()
  }

  ngOnChanges() {
    console.log('boardlist onchanges');
  }

  private getBoards() {
    this.boardsService.getUserList().subscribe((data)=>{ this.boards = data; }, (error) => { this.errorHandler(error) })
  }

  private errorHandler(error) {
    debugger;
  }

}
