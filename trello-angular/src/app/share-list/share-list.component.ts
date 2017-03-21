import { Component, OnInit, Input } from '@angular/core';
import { BoardsService } from '../services/boards.service';
import { ShareBoard } from '../classes/board';
import { ActivatedRoute } from '@angular/router';

import { LoginService } from '../services/login.service';
import { Response} from '@angular/http';
import { Board } from '../classes/board';
import { SharingComponent } from '../sharing/sharing.component';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-share-list',
  templateUrl: './share-list.component.html',
  styleUrls: ['./share-list.component.css'],
  providers: [BoardsService]
})
export class ShareListComponent implements OnInit {

  private shareBoards: ShareBoard[];
  private sub;

  boardId: number;

  constructor(private boardService: BoardsService,
              private route: ActivatedRoute,
              private loginService: LoginService,
              private modalService: NgbModal) {
    this.shareBoards = [];
   }

  ngOnInit() {
    this.sub = this.route.params.subscribe((params) => {
			this.boardId = +params['id'];
      this.getShareList(this.boardId);
    });
  }

  onClickShareBoard(boardId: number, event) {
    
    event.stopPropagation();
    const modalRef = this.modalService.open(SharingComponent);
    modalRef.componentInstance.boardId = boardId; 
    modalRef.result
	    	.then((result) => { this.getShareList(this.boardId); })
	    	.catch((reason)=> { this.getShareList(this.boardId); });
    return false;
  }
  

  private getShareList(boardId: number) {
    this.boardService.getShareList(this.boardId)
                        .subscribe( (data)=>{this.shareBoards = data},
                                    (error) => {debugger} );
  }
}

