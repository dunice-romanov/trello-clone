import { Component, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BoardsService } from '../services/boards.service';

@Component({
  selector: 'app-sharing',
  templateUrl: './sharing.component.html',
  styleUrls: ['./sharing.component.css'],
  providers: [BoardsService]
})
export class SharingComponent {
	readonly TEXT_SHARE_OK = "Complete!";
	readonly TEXT_ERROR_USER_DOESNT_EXISTS = "User doesn't exists";
	readonly TEXT_ERROR_SERVER_PROBLEM = "Server is unavailable";
	private username: string;
	private isWritable: boolean;

	@Input() boardId;
	constructor(public activeModal: NgbActiveModal, 
				private boardService: BoardsService) {
		this.username = '';
		this.isWritable = false;
	}


	onClickShare() {
		let username = this.username.trim();
		if (username == '') { return; }

		this.shareWith(this.username, this.boardId, this.isWritable);
		
	}

	/*
		Shares board with username, 
			if ok -> shows alert and closes self
			else -> handles error
	*/
	private shareWith(username: string, boardId: number, isWritable: boolean){
		let right: string = 'read';
		if (isWritable) right = 'write';
		this.boardService.shareBoard(boardId, username, right)
						.subscribe(
							(data) => {
								alert(this.TEXT_SHARE_OK);
								this.activeModal.close('Close click');
							}, 
							(error)=>{ this.errorHandler(error); }
						);
		
	}

	/*
		Handles boardService errors
	*/
	private errorHandler(error) {
		switch (error['_body']) {
		case this.boardService.ERROR_USER_DOES_NOT_EXISTS:
			alert(this.TEXT_ERROR_USER_DOESNT_EXISTS);
			this.username = '';
			break;
		default:
			alert(this.TEXT_ERROR_SERVER_PROBLEM);
			break;
		}
	}

}
