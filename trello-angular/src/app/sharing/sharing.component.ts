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
	private username: string;

	@Input() boardId;
	constructor(public activeModal: NgbActiveModal, 
				private boardService: BoardsService) {
		this.username = '';
	}


	onClickShare() {
		let username = this.username.trim();
		if (username == '') { return; }

		this.shareWith(this.username, this.boardId);
		
	}

	private shareWith(username: string, boardId: Number){

		this.boardService.shareBoard(boardId, username)
						.subscribe((data) => {
							console.log('shared button pressed'); 
							this.activeModal.close('Close click');
						}, (error)=>{ debugger; });
		
	}

}
